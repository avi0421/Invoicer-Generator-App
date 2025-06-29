'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode JWT token to get user info
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          // Check if token is expired
          if (payload.exp * 1000 > Date.now()) {
            setUser({ 
              id: payload.userId, 
              email: payload.email,
              name: payload.name
            });
          } else {
            // Token expired, remove it
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Invalid token:', err);
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login for:', email);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        setUser({ 
          id: data.user.id, 
          email: data.user.email,
          name: data.user.name
        });
        console.log('Login successful');
        return { success: true };
      } else {
        console.error('Login failed:', data.error);
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('Attempting registration for:', email);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful, automatically log in the user
        if (data.token) {
          localStorage.setItem('token', data.token);
          setUser({ 
            id: data.user.id, 
            email: data.user.email,
            name: data.user.name 
          });
        }
        console.log('Registration successful');
        return { success: true };
      } else {
        console.error('Registration failed:', data.error);
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const updateToken = (newToken) => {
    localStorage.setItem('token', newToken);
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ 
        id: payload.userId, 
        email: payload.email,
        name: payload.name
      });
    } catch (err) {
      console.error('Invalid token format:', err);
    }
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    updateToken,
    getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};