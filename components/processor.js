// components/FileProcessor.js
import { useState } from 'react';

export default function FileProcessor() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'video/mp4') {
      setFile(selectedFile);
      setMessage(`Selected file: ${selectedFile.name}`);
      setStatus('ready');
    } else {
      setMessage('Please select a valid MP4 file');
      setStatus('error');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setStatus('uploading');
      setMessage('Uploading file...');

      // Simulate upload for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      setMessage('Processing complete! (This is a demo message)');
      setStatus('complete');

    } catch (error) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Video File Processor</h2>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept="video/mp4"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Choose MP4 File
          </label>
          
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              {file.name}
            </p>
          )}
        </div>

        {file && (
          <button 
            onClick={handleUpload}
            disabled={status === 'uploading'}
            className={`w-full py-2 px-4 rounded-md text-white ${
              status === 'uploading' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {status === 'uploading' ? 'Processing...' : 'Process File'}
          </button>
        )}

        {message && (
          <div className={`p-4 rounded-md ${
            status === 'error' 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}