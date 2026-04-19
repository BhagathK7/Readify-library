// frontend/src/App.jsx

import React, { useState, useEffect, useContext, createContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthorDashboard from './pages/AuthorDashboard';
import BookPreview from './pages/BookPreview';
import BookReader from './pages/BookReader';
import { AuthContext } from './context/AuthContext';
import './styles/global.css';

export const ThemeContext = createContext();

export default function App() {
  const location = useLocation();
  const { user, loadingUser } = useContext(AuthContext);

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  const hideSidebar = ['/login', '/register'].includes(location.pathname);

  // ✅ NEW: hide header too
  const hideHeader = ['/login', '/register'].includes(location.pathname);

  if (loadingUser) {
    return <div className="loading-state">Loading...</div>;
  }

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      <div className="app-container">
        {!hideSidebar && <Sidebar userRole={user?.role} />}
        <div className="main-content-wrapper">
          
          {!hideHeader && <Header />} {/* ✅ FIXED */}

          <main className="main-content content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/books/:id/preview" element={<BookPreview />} />
              <Route path="/reader/:id" element={<BookReader />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <div>Access Denied</div>} />
              <Route path="/author-dashboard" element={user?.role === 'author' ? <AuthorDashboard /> : <div>Access Denied</div>} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}