import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

export default function SummaryPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    
    async function fetchSummary() {
      try {
        setLoading(true);
        const response = await fetch(`/.netlify/functions/get-summary/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch summary');
        }
        
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        console.error('Error fetching summary:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSummary();
  }, [id]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
    }
  }, [user, loading]);

  if (!id || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            Error: {error}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{summary?.originalFileName || 'Video Summary'} | Video Processing Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Header title={summary?.originalFileName || 'Video Summary'} />
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Summary</h2>
                <div className="prose max-w-none">
                  {summary?.summary.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Audio</h2>
                {summary?.audioUrl && (
                  <audio controls className="w-full">
                    <source src={summary.audioUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Full Transcript</h2>
                <details>
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Show full transcript
                  </summary>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                    {summary?.transcript.split('\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 