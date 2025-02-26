import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <span className="flex items-center cursor-pointer">
                <svg className="h-8 w-8 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" opacity="0.2" />
                  <path d="M16 12l-6 4V8l6 4z" />
                </svg>
                <span className={`ml-2 text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                  Video Processor
                </span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features">
              <span className={`text-sm font-medium cursor-pointer ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}>
                Features
              </span>
            </Link>
            
            {user && (
              <>
                <Link href="/dashboard">
                  <span className={`text-sm font-medium cursor-pointer ${
                    router.pathname === '/dashboard' 
                      ? 'text-indigo-600' 
                      : isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
                  }`}>
                    Dashboard
                  </span>
                </Link>
                <Link href="/automation">
                  <span className={`text-sm font-medium cursor-pointer ${
                    router.pathname === '/automation' 
                      ? 'text-indigo-600' 
                      : isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
                  }`}>
                    Automation
                  </span>
                </Link>
              </>
            )}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <img
                    src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=6366F1&color=fff`}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full border-2 border-indigo-200"
                  />
                  <span className={`ml-2 text-sm font-medium ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                    {user.user_metadata?.full_name || user.email.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className={`text-sm font-medium px-4 py-2 rounded-lg ${
                    isScrolled 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-white text-indigo-600 hover:bg-gray-100'
                  }`}
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={login}
                className={`text-sm font-medium px-4 py-2 rounded-lg ${
                  isScrolled 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-white text-indigo-600 hover:bg-gray-100'
                }`}
              >
                Sign in
              </button>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${
                isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-gray-200'
              }`}
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/#features">
              <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Features
              </span>
            </Link>
            
            {user && (
              <>
                <Link href="/dashboard">
                  <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname === '/dashboard' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                    Dashboard
                  </span>
                </Link>
                <Link href="/automation">
                  <span className={`block px-3 py-2 rounded-md text-base font-medium ${
                    router.pathname === '/automation' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}>
                    Automation
                  </span>
                </Link>
              </>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-5 space-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email)}&background=6366F1&color=fff`}
                      alt="User avatar"
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user.user_metadata?.full_name || user.email.split('@')[0]}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="px-5">
                <button
                  onClick={login}
                  className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Sign in
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 