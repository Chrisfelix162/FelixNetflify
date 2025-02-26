import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FileProcessor from '../components/FileProcessor';

export default function Dashboard() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, authReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in
    if (authReady && !user) {
      router.push('/');
    }
  }, [user, authReady, router]);

  useEffect(() => {
    // Fetch user's summaries
    if (user) {
      const fetchSummaries = async () => {
        try {
          setLoading(true);
          // This would be replaced with your actual API call
          // const response = await fetch(`/.netlify/functions/get-summaries?userId=${user.id}`);
          // const data = await response.json();
          // setSummaries(data);
          
          // Placeholder data for now
          setSummaries([
            {
              id: '1',
              originalFileName: 'Product Demo.mp4',
              createdAt: new Date().toISOString(),
              duration: '5:32',
              status: 'completed'
            },
            {
              id: '2',
              originalFileName: 'Team Meeting.mp4',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              duration: '32:15',
              status: 'completed'
            }
          ]);
        } catch (error) {
          console.error('Error fetching summaries:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSummaries();
    }
  }, [user]);

  if (!authReady || (authReady && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse bg-white p-6 rounded-lg shadow-md">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Dashboard | Video Processor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Process new videos or view your existing summaries</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Summaries</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse bg-gray-100 p-4 rounded-lg">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : summaries.length > 0 ? (
                <div className="space-y-4">
                  {summaries.map((summary) => (
                    <div key={summary.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-800">{summary.originalFileName}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(summary.createdAt).toLocaleDateString()} • {summary.duration}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {summary.status}
                        </span>
                      </div>
                      <div className="mt-3 flex space-x-3">
                        <button 
                          onClick={() => router.push(`/summary/${summary.id}`)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View Summary
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-800">
                          Download
                        </button>
                        <button className="text-sm text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't created any summaries yet</p>
                  <p className="text-sm text-gray-600">Upload your first video to get started</p>
                </div>
              )}
              
              {summaries.length > 0 && (
                <div className="mt-6 text-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All Summaries
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Process New Video</h2>
              <FileProcessor />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 