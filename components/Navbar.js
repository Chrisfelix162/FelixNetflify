import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Navbar() {
  const { user, login, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-gray-800 cursor-pointer">Video Processor</span>
        </Link>
        
        <div className="flex items-center">
          {!user ? (
            <button 
              onClick={login}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user.user_metadata.full_name || user.email}</span>
              <Link href="/dashboard">
                <span className="text-blue-600 hover:text-blue-800 cursor-pointer">Dashboard</span>
              </Link>
              <button 
                onClick={logout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 