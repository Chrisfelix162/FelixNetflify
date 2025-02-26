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
    console.log('Received video processing request');
    
    // Parse form data
    const { fields, files } = await parseFormData(event);
    
    if (!files || !files.file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file uploaded' })
      };
    }
    
    const userId = fields.userId;
    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }
    
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
    
    console.log(`Processing video: ${videoFileName}`);
    
    // Extract audio from video
    const audioPath = path.join(tempDir, 'audio.mp3');
    await extractAudio(videoPath, audioPath);
    
    // Upload audio to Azure Blob Storage
    const audioUploadResult = await uploadToAzureStorage(audioPath, `${jobId}/audio.mp3`);
    
    // Transcribe audio
    const transcript = await transcribeAudio(audioPath);
    
    // Generate summary
    const summary = await generateSummary(transcript, summaryLength, summaryStyle, focusAreas);
    
    // Create summary item in Cosmos DB
    const summaryItem = {
      id: jobId,
      userId,
      originalFileName: videoFileName,
      transcript,
      summary,
      audioUrl: audioUploadResult.url,
      config: {
        length: summaryLength,
        style: summaryStyle,
        focusAreas
      },
      createdAt: new Date().toISOString()
    };
    
    await container.items.create(summaryItem);
    console.log(`Created summary with ID: ${jobId}`);
    
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
    try {
      const formData = new formidable.IncomingForm();
      
      // Create a mock request object
      const req = {
        headers: event.headers,
      };
      
      // For Netlify Functions, we need to handle the body differently
      if (event.isBase64Encoded) {
        req.body = Buffer.from(event.body, 'base64');
      } else {
        req.body = event.body;
      }
      
      formData.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form data:', err);
          reject(err);
          return;
        }
        resolve({ fields, files });
      });
    } catch (error) {
      console.error('Error in parseFormData:', error);
      reject(error);
    }
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