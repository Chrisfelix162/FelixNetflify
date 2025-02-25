const { CosmosClient } = require('@azure/cosmos');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const os = require('os');
const formidable = require('formidable');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { OpenAI } = require('openai');
const { Deepgram } = require('@deepgram/sdk');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegPath);

// Initialize Azure Cosmos DB client
const cosmosClient = new CosmosClient({
  endpoint: process.env.COSMOS_ENDPOINT,
  key: process.env.COSMOS_KEY
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Deepgram client
const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

// Initialize Azure Blob Storage client
const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient('video-processing');

// Database and container references
const database = cosmosClient.database(process.env.COSMOS_DATABASE);
const container = database.container('summaries');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse form data
    const { fields, files } = await parseFormData(event);
    const userId = fields.userId;
    const summaryLength = fields.summaryLength || 'medium';
    const summaryStyle = fields.summaryStyle || 'concise';
    const focusAreas = JSON.parse(fields.focusAreas || '[]');
    
    // Generate unique ID for this processing job
    const jobId = uuidv4();
    
    // Create temp directory
    const tempDir = path.join(os.tmpdir(), jobId);
    fs.mkdirSync(tempDir, { recursive: true });
    
    // Get video file
    const videoFile = files.file;
    const videoPath = videoFile.filepath;
    const videoFileName = videoFile.originalFilename;
    
    // Extract audio from video
    const audioPath = path.join(tempDir, 'audio.mp3');
    await extractAudio(videoPath, audioPath);
    
    // Upload audio to Azure Blob Storage
    const audioBlob = await uploadToAzureStorage(audioPath, `${jobId}/audio.mp3`);
    
    // Transcribe audio using Deepgram
    const transcript = await transcribeAudio(audioPath);
    
    // Generate summary using OpenAI
    const summary = await generateSummary(transcript, summaryLength, summaryStyle, focusAreas);
    
    // Store metadata in Cosmos DB
    const summaryItem = {
      id: jobId,
      userId,
      originalFileName: videoFileName,
      audioUrl: audioBlob.url,
      transcript,
      summary,
      summaryConfig: {
        length: summaryLength,
        style: summaryStyle,
        focusAreas
      },
      createdAt: new Date().toISOString()
    };
    
    await container.items.create(summaryItem);
    
    // Clean up temp files
    fs.unlinkSync(audioPath);
    fs.rmdirSync(tempDir, { recursive: true });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        summaryId: jobId
      })
    };
    
  } catch (error) {
    console.error('Error processing video:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process video',
        details: error.message
      })
    };
  }
};

// Helper function to parse form data
function parseFormData(event) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true });
    
    form.parse(event, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
}

// Helper function to extract audio from video
function extractAudio(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .on('end', () => resolve())
      .on('error', (err) => reject(err))
      .run();
  });
}

// Helper function to upload file to Azure Blob Storage
async function uploadToAzureStorage(filePath, blobName) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  const fileBuffer = fs.readFileSync(filePath);
  
  const uploadResponse = await blockBlobClient.upload(
    fileBuffer,
    fileBuffer.length
  );
  
  return {
    url: blockBlobClient.url,
    etag: uploadResponse.etag
  };
}

// Helper function to transcribe audio using Deepgram
async function transcribeAudio(audioPath) {
  const audioBuffer = fs.readFileSync(audioPath);
  
  const response = await deepgram.transcription.preRecorded(
    { buffer: audioBuffer, mimetype: 'audio/mp3' },
    { punctuate: true, diarize: true }
  );
  
  return response.results.channels[0].alternatives[0].transcript;
}

// Helper function to generate summary using OpenAI
async function generateSummary(transcript, length, style, focusAreas) {
  let prompt = `Summarize the following transcript in a ${length} ${style} format:\n\n${transcript}\n\n`;
  
  if (focusAreas.length > 0) {
    prompt += `Focus on the following areas: ${focusAreas.join(', ')}.`;
  }
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant that summarizes video transcripts accurately and concisely." },
      { role: "user", content: prompt }
    ],
    max_tokens: 1000,
    temperature: 0.5
  });
  
  return response.choices[0].message.content;
} 