import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FileProcessor from '../components/FileProcessor'
import Navbar from '../components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Video Processing Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <Header title="Video Processing Service" />
        <p className="text-center text-gray-600 mb-8">
          Upload your video files to generate summaries using AI
        </p>
        <FileProcessor />
      </main>

      <Footer />
    </div>
  )
}