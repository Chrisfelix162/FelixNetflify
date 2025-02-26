import { createContext, useContext, useState, useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Initialize Netlify Identity
    netlifyIdentity.init();

    // Set user if already logged in
    netlifyIdentity.on('init', (user) => {
      setUser(user);
      setAuthReady(true);
    });

    // Set user on login
    netlifyIdentity.on('login', (user) => {
      setUser(user);
      netlifyIdentity.close();
    });

    // Clear user on logout
    netlifyIdentity.on('logout', () => {
      setUser(null);
    });

    // Cleanup
    return () => {
      netlifyIdentity.off('init');
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const login = () => {
    netlifyIdentity.open('login');
  };

  const logout = () => {
    netlifyIdentity.logout();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 