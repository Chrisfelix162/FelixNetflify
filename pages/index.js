import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FileProcessor from '../components/FileProcessor'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>File Processing Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="File Processing Service" />
        <FileProcessor />
      </main>

      <Footer />
    </div>
  )
}