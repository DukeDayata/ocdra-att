import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('att_token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('att_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Validate stored session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('att_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.user) {
            setUser(res.user);
            localStorage.setItem('att_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification expired or failed:', err.message);
          // Only clear if 401 unauthorized
          if (err.message?.includes('expired') || err.message?.includes('authorized')) {
            localStorage.removeItem('att_token');
            localStorage.removeItem('att_user');
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (credentials) => {
    try {
      const res = await authApi.login(credentials);
      if (res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('att_token', res.token);
        localStorage.setItem('att_user', JSON.stringify(res.user));
        toast.success(`Welcome back, ${res.user.name || res.user.username}!`);
        return { success: true, user: res.user };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('att_token');
    localStorage.removeItem('att_user');
    toast.success('Signed out successfully');
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === 'admin',
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
