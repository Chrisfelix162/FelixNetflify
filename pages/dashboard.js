import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (!user && !loading) {
      router.push('/');
      return;
    }

    if (user) {
      fetchSummaries();
    }
  }, [user]);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/.netlify/functions/list-summaries?userId=${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch summaries');
      }
      
      const data = await response.json();
      setSummaries(data);
    } catch (err) {
      console.error('Error fetching summaries:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Dashboard | Video Processing Service</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <Header title="Your Processed Videos" />
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            Error: {error}
          </div>
        ) : summaries.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">No videos processed yet</h3>
            <p className="mt-2 text-gray-500">Upload your first video to get started</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Upload Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {summaries.map((summary) => (
              <div key={summary.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {summary.originalFileName}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
} 