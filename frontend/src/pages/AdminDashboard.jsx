// frontend/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { fetchJSON } from '../utils/api';
import BookManagement from '../components/BookManagement';
import OrderManagement from '../components/OrderManagement'; // This is a new component we'll create

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchJSON('/admin/stats');
        setStats(res);
      } catch (e) {
        console.error('Failed to fetch stats:', e);
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
  }, []);

  const renderContent = () => {
    if (loadingStats) {
      return <div>Loading...</div>;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="content-card">
            <h2>Admin Dashboard</h2>
            <div className="admin-stats-grid">
              <div className="stat-card">
                <h3>Users</h3>
                <div className="stat-value">{stats?.usersCount}</div>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <div className="stat-value">{stats?.ordersCount}</div>
              </div>
              <div className="stat-card">
                <h3>Books</h3>
                <div className="stat-value">{stats?.booksCount}</div>
              </div>
              <div className="stat-card">
                <h3>Total Sales</h3>
                <div className="stat-value">₹{stats?.totalSales.toFixed(2)}</div>
              </div>
            </div>
          </div>
        );
      case 'books':
        return <BookManagement />;
      case 'orders':
        return <OrderManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
          Dashboard
        </button>
        <button className={activeTab === 'books' ? 'active' : ''} onClick={() => setActiveTab('books')}>
          Book Management
        </button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
          Order Management
        </button>
      </div>
      {renderContent()}
    </div>
  );
}