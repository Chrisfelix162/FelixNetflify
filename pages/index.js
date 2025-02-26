import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FileProcessor from '../components/FileProcessor'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function Home() {
  const { user, authReady } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Video Processing Service</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <Header title="Video Processing Service" />
        <p className="text-center text-gray-600 mb-8 max-w-2xl">
          Upload your video files to generate AI-powered summaries. Our service extracts audio, 
          transcribes content, and creates concise summaries tailored to your preferences.
        </p>
        
        {authReady && (
          user ? <FileProcessor /> : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
              <h2 className="text-xl font-semibold mb-4">Sign in to get started</h2>
              <p className="text-gray-600 mb-6">
                Please sign in with your Google account to upload and process videos.
              </p>
            </div>
          )
        )}
      </main>

      <Footer />
    </div>
  )
}