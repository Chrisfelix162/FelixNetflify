import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import AuthButton from './AuthButton';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <nav className="bg-white shadow-md py-4">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-gray-800 cursor-pointer">Video Processor</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          {user && (
            <>
              <Link href="/">
                <span className={`text-sm font-medium ${router.pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                  Upload
                </span>
              </Link>
              <Link href="/dashboard">
                <span className={`text-sm font-medium ${router.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                  Dashboard
                </span>
              </Link>
              <Link href="/automation">
                <span className={`text-sm font-medium ${router.pathname === '/automation' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}>
                  Automation
                </span>
              </Link>
            </>
          )}
          <AuthButton />
        </div>
      </div>
    </nav>
  );
} 