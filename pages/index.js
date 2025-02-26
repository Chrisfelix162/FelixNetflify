import Head from 'next/head'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Home() {
  const { user, login, authReady } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Head>
        <title>Video Processor | AI-Powered Video Summaries</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Transform your videos into concise, actionable summaries with our AI-powered video processing service." />
      </Head>

      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                  <span className="block">Transform Videos into</span>
                  <span className="block text-indigo-600">Actionable Insights</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl">
                  Our AI-powered video processing service extracts audio, transcribes content, and generates 
                  concise summaries tailored to your needs. Save time and extract key information effortlessly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleGetStarted}
                    className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition duration-300 text-center transform hover:-translate-y-1"
                  >
                    {user ? 'Go to Dashboard' : 'Get Started'}
                  </button>
                  <a 
                    href="#features" 
                    className="px-8 py-4 bg-white hover:bg-gray-50 text-indigo-600 font-medium rounded-lg border border-indigo-100 shadow-md hover:shadow-lg transition duration-300 text-center transform hover:-translate-y-1"
                  >
                    Learn More
                  </a>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition duration-500">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                    alt="Video processing illustration" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our intelligent platform simplifies the process of extracting valuable information from videos
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">1. Upload</h3>
                <p className="text-gray-600">
                  Upload your video files in various formats. Our system handles the processing automatically.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">2. Process</h3>
                <p className="text-gray-600">
                  Our AI extracts audio, transcribes the content, and analyzes the information with advanced algorithms.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-8 shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">3. Summarize</h3>
                <p className="text-gray-600">
                  Get concise, customizable summaries that capture the key points from your video in your preferred format.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how our video processing service is helping professionals save time
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-indigo-600">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                    <p className="text-gray-500 text-sm">Marketing Director</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "This tool has revolutionized how we process our marketing videos. The summaries are accurate and save us hours of work."
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-indigo-600">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                    <p className="text-gray-500 text-sm">Product Manager</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "We use this for all our product demos and customer interviews. The ability to quickly extract key points is invaluable."
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-indigo-600">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Alex Rivera</h4>
                    <p className="text-gray-500 text-sm">Content Creator</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "As a content creator, this tool helps me review and repurpose my long-form videos into multiple formats efficiently."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-indigo-600">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Ready to transform your videos?</h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-3xl mx-auto">
              Join thousands of users who save time by automatically generating summaries from their videos.
            </p>
            <button 
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              {user ? 'Go to Dashboard' : 'Get Started for Free'}
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}