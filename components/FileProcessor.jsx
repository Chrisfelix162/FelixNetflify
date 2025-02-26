// components/FileProcessor.jsx
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

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
  const dropAreaRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const dropArea = dropAreaRef.current
    
    if (!dropArea) return
    
    const preventDefaults = (e) => {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const highlight = () => {
      dropArea.classList.add('bg-blue-50', 'border-blue-300')
    }
    
    const unhighlight = () => {
      dropArea.classList.remove('bg-blue-50', 'border-blue-300')
    }
    
    const handleDrop = (e) => {
      const dt = e.dataTransfer
      const files = dt.files
      
      if (files.length) {
        handleFiles(files[0])
      }
    }
    
    // Add event listeners
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)
    })
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false)
    })
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })
    
    dropArea.addEventListener('drop', handleDrop, false)
    
    return () => {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, preventDefaults)
      })
      
      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.removeEventListener(eventName, highlight)
      })
      
      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.removeEventListener(eventName, unhighlight)
      })
      
      dropArea.removeEventListener('drop', handleDrop)
    }
  }, [])

  const handleFiles = (selectedFile) => {
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

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0]
    handleFiles(selectedFile)
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
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          setProgress(percentComplete)
          
          if (percentComplete === 100) {
            setMessage('Processing video...')
          }
        }
      })
      
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText)
          setStatus('success')
          setMessage('Video processed successfully!')
          
          // Redirect to summary page
          setTimeout(() => {
            router.push(`/summary/${response.summaryId}`)
          }, 1500)
        } else {
          setStatus('error')
          setMessage(`Error: ${xhr.statusText || 'Failed to process video'}`)
          console.error('Server response:', xhr.responseText)
        }
      })
      
      xhr.addEventListener('error', () => {
        setStatus('error')
        setMessage('Network error occurred')
        console.error('XHR error occurred')
      })
      
      xhr.open('POST', '/.netlify/functions/process-video')
      
      // Make sure we have the token before sending
      if (user && user.token && user.token.access_token) {
        xhr.setRequestHeader('Authorization', `Bearer ${user.token.access_token}`)
      } else {
        console.log('User token information:', user)
      }
      
      xhr.send(formData)
      
    } catch (error) {
      console.error('Error processing video:', error)
      setStatus('error')
      setMessage(`Error: ${error.message}`)
    }
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div 
            ref={dropAreaRef}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center cursor-pointer transition-colors duration-200"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4"
              className="hidden"
            />
            
            <div className="flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              
              <p className="text-lg font-medium text-gray-700 mb-1">
                {file ? file.name : 'Drag and drop your video here'}
              </p>
              <p className="text-sm text-gray-500">
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'or click to browse (MP4 only, max 100MB)'}
              </p>
            </div>
          </div>

          {file && status === 'ready' && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">Summary Options</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
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
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
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
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
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