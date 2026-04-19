// frontend/src/pages/UserDashboard.jsx

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchJSON } from '../utils/api';
import BookCard from '../components/BookCard'; // THIS IS THE CRITICAL IMPORT
import ReadingChallengeForm from '../components/ReadingChallengeForm';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  const { user, toggleWishlist } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    try {
      const res = await fetchJSON('/auth/challenges');
      setChallenges(res);
    } catch (e) {
      console.error('Failed to fetch challenges:', e);
      setChallenges([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [ordersRes, challengesRes] = await Promise.all([
          fetchJSON('/orders/myorders'),
          fetchJSON('/auth/challenges')
        ]);
        setOrders(ordersRes.orders || []);
        setChallenges(challengesRes || []);
      } catch (e) {
        console.error(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const allBooks = orders.flatMap(o => o.items.map(i => i.book)).filter(b => b !== null);
      const uniqueBooks = [...new Map(allBooks.map(item => [item._id, item])).values()];
      setPurchasedBooks(uniqueBooks);
    }
  }, [orders]);

  const getProgressPercentage = (challenge) => {
    return (challenge.currentProgress / challenge.target) * 100;
  };

  if (loading || !user) return <div>Loading dashboard...</div>;

  return (
    <div className="user-dashboard-page">
      <div className="content-card">
        <h2>Welcome, {user.name}!</h2>
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Books Read</h3>
            <div className="stat-value">12</div>
          </div>
          <div className="stat-card">
            <h3>Current Streak</h3>
            <div className="stat-value">5 <small>Days</small></div>
          </div>
          <div className="stat-card">
            <h3>Reading Goal</h3>
            <div className="stat-value">75<small>%</small></div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h3>My Library</h3>
        {purchasedBooks.length > 0 ? (
          <div className="book-grid">
            {purchasedBooks.map(book => (
              <div key={book._id} className="book-card">
                <Link to={`/reader/${book._id}`}>
                  <img src={book.coverImage} alt={book.title} />
                </Link>
                <div className="book-title">{book.title}</div>
                <Link to={`/reader/${book._id}`} className="btn-primary" style={{marginTop: 'auto'}}>Read Now</Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">Your library is empty.</div>
        )}
      </div>

      <div className="content-card">
        <div className="flex-header">
          <h3>My Reading Challenges</h3>
          <button className="btn-primary" onClick={() => setShowChallengeForm(true)}>
            Set New Challenge
          </button>
        </div>
        {showChallengeForm && <ReadingChallengeForm onClose={() => setShowChallengeForm(false)} onChallengeAdded={fetchChallenges} />}
        {challenges.length > 0 ? (
          <div className="reading-challenges-list">
            {challenges.map(challenge => (
              <div key={challenge._id} className="challenge-card">
                <div className="challenge-header">
                  <h4>{challenge.title}</h4>
                  <span className={`challenge-status ${challenge.status}`}>
                    {challenge.status}
                  </span>
                </div>
                <p>{challenge.description}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${getProgressPercentage(challenge)}%` }}></div>
                </div>
                <div className="progress-text">
                  {challenge.currentProgress} / {challenge.target} {challenge.unit}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">No active challenges. Set one now!</div>
        )}
      </div>

      <div className="content-card">
        <h3>My Wishlist</h3>
        {user.wishlist && user.wishlist.length > 0 ? (
          <div className="book-grid">
            {user.wishlist.map(book => (
              <div key={book._id}>
                <BookCard book={book} onAdd={() => alert('Add to cart logic here')} />
              </div>
            ))}
          </div>
        ) : (
          <div className="muted">Your wishlist is empty.</div>
        )}
      </div>

      <div className="content-card">
        <h3>My Orders</h3>
        {orders.length ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o._id}>
                    <td>#{o._id.substring(18)}</td>
                    <td>₹{o.totalPrice}</td>
                    <td>{o.status}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="muted">No orders yet.</div>}
      </div>
    </div>
  );
}