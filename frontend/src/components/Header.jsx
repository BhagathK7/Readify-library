// frontend/src/components/Header.jsx
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ThemeContext } from '../App';

export default function Header({ showSearch = true }) {
  const { user, logout } = useContext(AuthContext);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/books?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <circle cx="11" cy="11" r="8"></circle>
    </svg>
  );

  return (
    <header className="header">

      {/* ✅ SHOW ONLY WHEN NEEDED */}
      {showSearch && (
        <form onSubmit={handleSearch} className="header-search-form">
          <IconSearch />
          <input
            type="text"
            placeholder="Search books authors..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </form>
      )}

      <div className="header-right">
        <button className="header-icon-btn">🔔</button>

        <label className="theme-toggle">
          <input type="checkbox" checked={isDarkTheme} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>

        {user ? (
          <div className="user-options">
            <div className="user-avatar" onClick={() => setShowDropdown(!showDropdown)}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            {showDropdown && (
              <div className="user-options-dropdown">
                <Link to="/dashboard">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn-primary">Sign In</Link>
        )}
      </div>
    </header>
  );
}