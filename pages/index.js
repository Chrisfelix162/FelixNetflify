// pages/index.js
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FileProcessor from '../components/FileProcessor'


export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>File Processing Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen py-20">
        <Header title="File Processing Service" />
        <FileProcessor />
      </main>

      <Footer />
    </div>
  )
}