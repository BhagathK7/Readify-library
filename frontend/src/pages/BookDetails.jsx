// frontend/src/pages/BookDetails.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchJSON } from '../utils/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { user, toggleWishlist } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const navigate = useNavigate();

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const isBookInWishlist = user?.wishlist?.some(b => b._id === id);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchJSON(`/books/${id}`);
        setBook(res);
        setReviewSubmitted(false);
      } catch (e) {
        console.error(e.message);
      }
    };
    load();
  }, [id, reviewSubmitted]);

  const onAdd = () => addToCart(book, 1);

  const handleToggleWishlist = async () => {
    if (!user) {
      alert('You must be logged in to manage your wishlist.');
      navigate('/login');
      return;
    }
    const message = await toggleWishlist(book._id);
    if (message) {
      alert(message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to leave a review.');
      return;
    }
    try {
      await fetchJSON(`/books/${id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      });
      alert('Review submitted successfully!');
      setReviewSubmitted(true);
      setRating(5);
      setComment('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchJSON(`/books/${id}/progress`, {
        method: 'PUT',
        body: JSON.stringify({ progress: readingProgress })
      });
      alert('Progress updated successfully!');
      setShowProgressModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const renderStars = (num) => {
    const roundedRating = Math.round(num);
    const fullStars = '★'.repeat(roundedRating);
    const emptyStars = '☆'.repeat(5 - roundedRating);
    return `${fullStars}${emptyStars}`;
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="content-card book-details-page">
      <div className="book-details-main">
        <div className="detail-left">
          <img src={book.coverImage || 'https://via.placeholder.com/300x400'} alt={book.title} />
        </div>
        <div className="detail-right">
          <div className="detail-header">
            <h2>{book.title}</h2>
            <div className="muted">By {book.author}</div>
            <div className="flex-row">
              <div className="book-rating">{renderStars(book.rating)}</div>
              <div className="muted">({book.numReviews} ratings)</div>
            </div>
            <div className="book-price">₹{book.price}</div>
          </div>
          <div className="book-actions">
            <button className="btn-primary" onClick={onAdd}>Add to Cart</button>
            <button className="btn-secondary" onClick={() => navigate(`/books/${book._id}/preview`)}>Read Sample</button>
            <button className="btn-ghost" onClick={handleToggleWishlist}>
              {isBookInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
            </button>
          </div>
          {user && (
            <div className="progress-actions">
                <button className="btn-outline" onClick={() => setShowProgressModal(true)}>Update Progress</button>
            </div>
          )}
          <p className="book-description">{book.description || 'No description provided.'}</p>
        </div>
      </div>

      <div className="reviews-section">
        <h3>User Reviews</h3>
        <form onSubmit={submitReview} className="review-form">
          <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your review..." />
          <div className="flex-row review-form-actions">
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <button className="btn-primary" type="submit">Submit</button>
          </div>
        </form>
        {book.reviews && book.reviews.length > 0 ? (
          book.reviews.map(r => (
            <div key={r._id} className="review-card">
              <div className="review-meta">
                <div className="review-user-name">{r.user?.name}</div>
                <div className="review-rating">{renderStars(r.rating)}</div>
              </div>
              <div className="review-comment">{r.comment}</div>
            </div>
          ))
        ) : <div className="muted">No reviews yet</div>}
      </div>

      {showProgressModal && (
        <div className="progress-modal-overlay">
          <div className="progress-modal-content">
            <h3>Update Reading Progress</h3>
            <form onSubmit={handleProgressSubmit}>
              <label>Progress: {readingProgress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={readingProgress}
                onChange={(e) => setReadingProgress(Number(e.target.value))}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Save Progress</button>
                <button type="button" className="btn-secondary" onClick={() => setShowProgressModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}