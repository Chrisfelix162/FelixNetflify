// components/FileProcessor.jsx
import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export default function FileProcessor() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [summaryConfig, setSummaryConfig] = useState({
    length: 'medium', // short, medium, long
    style: 'concise', // concise, detailed, bullet-points
    focusAreas: [] // empty array for no specific focus
  })
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile && selectedFile.type === 'video/mp4') {
      // Check file size (limit to 100MB for example)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setMessage('File size exceeds 100MB limit')
        setStatus('error')
        return
      }
      
      setFile(selectedFile)
      setMessage(`Selected file: ${selectedFile.name}`)
      setStatus('ready')
    } else {
      setMessage('Please select a valid MP4 file')
      setStatus('error')
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0]
      if (droppedFile.type === 'video/mp4') {
        if (droppedFile.size > 100 * 1024 * 1024) {
          setMessage('File size exceeds 100MB limit')
          setStatus('error')
          return
        }
        setFile(droppedFile)
        setMessage(`Selected file: ${droppedFile.name}`)
        setStatus('ready')
      } else {
        setMessage('Please select a valid MP4 file')
        setStatus('error')
      }
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    if (!file) {
      setMessage('Please select a file first')
      setStatus('error')
      return
    }
    
    if (!user) {
      setMessage('Please login to process files')
      setStatus('error')
      return
    }
    
    setStatus('processing')
    setMessage('Uploading file...')
    setProgress(0)
    
    // Create form data for file upload
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', user.id)
    formData.append('summaryLength', summaryConfig.length)
    formData.append('summaryStyle', summaryConfig.style)
    formData.append('focusAreas', JSON.stringify(summaryConfig.focusAreas))
    
    try {
      // Upload to Netlify function
      const response = await fetch('/.netlify/functions/process-video', {
        method: 'POST',
        body: formData,
        headers: {
          // No Content-Type header as it's set automatically with FormData
          'Authorization': `Bearer ${user.token.access_token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setProgress(percentCompleted)
          if (percentCompleted < 100) {
            setMessage(`Uploading: ${percentCompleted}%`)
          } else {
            setMessage('Processing video...')
          }
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to process video')
      }
      
      const result = await response.json()
      
      setMessage('Video processed successfully! Redirecting to summary...')
      setStatus('success')
      
      // Redirect to the summary page
      window.location.href = `/summary/${result.summaryId}`
      
    } catch (error) {
      console.error('Error processing video:', error)
      setMessage(`Error: ${error.message}`)
      setStatus('error')
    }
  }

  const handleConfigChange = (e) => {
    const { name, value } = e.target
    setSummaryConfig(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFocusAreaChange = (e) => {
    const { value, checked } = e.target
    setSummaryConfig(prev => {
      if (checked) {
        return { ...prev, focusAreas: [...prev.focusAreas, value] }
      } else {
        return { ...prev, focusAreas: prev.focusAreas.filter(area => area !== value) }
      }
    })
  }

  return (
    <div className="mt-10">
      <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Upload Video File</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600">Drag and drop your MP4 file here, or click to browse</p>
              <p className="text-sm text-gray-500">Maximum file size: 100MB</p>
            </div>
          </div>

          {file && status === 'ready' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Summary Configuration</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary Length</label>
                <select 
                  name="length"
                  value={summaryConfig.length}
                  onChange={handleConfigChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="short">Short (1-2 paragraphs)</option>
                  <option value="medium">Medium (3-4 paragraphs)</option>
                  <option value="long">Long (5+ paragraphs)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Summary Style</label>
                <select 
                  name="style"
                  value={summaryConfig.style}
                  onChange={handleConfigChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                  <option value="bullet-points">Bullet Points</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Focus Areas (Optional)</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="technical" 
                      value="technical"
                      checked={summaryConfig.focusAreas.includes('technical')}
                      onChange={handleFocusAreaChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="technical" className="ml-2 text-sm text-gray-700">Technical Details</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="key-points" 
                      value="key-points"
                      checked={summaryConfig.focusAreas.includes('key-points')}
                      onChange={handleFocusAreaChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="key-points" className="ml-2 text-sm text-gray-700">Key Points</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="action-items" 
                      value="action-items"
                      checked={summaryConfig.focusAreas.includes('action-items')}
                      onChange={handleFocusAreaChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="action-items" className="ml-2 text-sm text-gray-700">Action Items</label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-lg ${
              status === 'error' 
                ? 'bg-red-50 text-red-700' 
                : status === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-blue-50 text-blue-700'
            }`}>
              {message}
            </div>
          )}

          {status === 'processing' && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {file && status === 'ready' && (
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Process Video
            </button>
          )}
        </form>
      </div>
    </div>
  )
}