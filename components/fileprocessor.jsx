// components/FileProcessor.jsx
import { useState } from 'react'

export default function FileProcessor() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile && selectedFile.type === 'video/mp4') {
      setFile(selectedFile)
      setMessage(`Selected file: ${selectedFile.name}`)
      setStatus('ready')
    } else {
      setMessage('Please select a valid MP4 file')
      setStatus('error')
    }
  }

  return (
    <div className="mt-10">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Upload Video File</h2>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              status === 'error' 
                ? 'bg-red-50 text-red-700' 
                : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}