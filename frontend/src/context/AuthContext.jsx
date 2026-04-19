// frontend/src/context/AuthContext.jsx

import React, { createContext, useEffect, useState } from 'react';
import { fetchJSON } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await fetchJSON('/auth/profile', { method: 'GET' });
      setUser(res.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const login = async (email, password) => {
    const res = await fetchJSON('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password) => {
    const res = await fetchJSON('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    await fetchJSON('/auth/logout', { method: 'POST' });
    setUser(null);
    navigate('/');
  };

  const toggleWishlist = async (bookId) => {
    try {
      const res = await fetchJSON('/auth/wishlist', {
        method: 'POST',
        body: JSON.stringify({ bookId })
      });
      setUser(res.user);
      return res.message;
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loadingUser, login, register, logout, loadProfile, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};