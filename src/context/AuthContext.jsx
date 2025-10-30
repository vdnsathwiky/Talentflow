// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with your actual authentication endpoint
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          if (email && password) {
            resolve({
              user: {
                id: 1,
                email,
                name: email.split('@')[0],
              },
              token: 'mock-jwt-token-' + Date.now()
            });
          } else {
            resolve({ error: 'Invalid credentials' });
          }
        }, 1000);
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Simulate API call - replace with your actual registration endpoint
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          if (email && password && name) {
            resolve({
              user: {
                id: Date.now(),
                email,
                name,
              },
              token: 'mock-jwt-token-' + Date.now()
            });
          } else {
            resolve({ error: 'Registration failed' });
          }
        }, 1000);
      });

      if (response.error) {
        throw new Error(response.error);
      }

      setUser(response.user);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};