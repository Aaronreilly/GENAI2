import React, { createContext, useState, useCallback } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Check localStorage for existing session
    const saved = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return saved && token ? JSON.parse(saved) : null;
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password
      });
      
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return { success: false, error: 'Login failed' };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, name, role = 'user') => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:4000/api/auth/register', {
        email,
        password,
        name,
        role
      });
      
      if (res.data.success) {
        const { token: newToken, user: newUser } = res.data;
        setUser(newUser);
        setToken(newToken);
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [token]);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'business',
    isUser: user?.role === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
