import { createContext, useState, useEffect, useContext } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  authReady: false
});

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    netlifyIdentity.init();
    
    netlifyIdentity.on('login', (user) => {
      setUser(user);
      netlifyIdentity.close();
    });
    
    netlifyIdentity.on('logout', () => {
      setUser(null);
    });
    
    netlifyIdentity.on('init', () => {
      setUser(netlifyIdentity.currentUser());
      setAuthReady(true);
    });

    // Cleanup
    return () => {
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

  const context = { user, login, logout, authReady };
  
  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 