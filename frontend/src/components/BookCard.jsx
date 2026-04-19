// frontend/src/components/BookCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book, onAdd }) {
  const renderStars = (rating) => {
    const roundedRating = Math.round(rating);
    const fullStars = '★'.repeat(roundedRating);
    const emptyStars = '☆'.repeat(5 - roundedRating);
    return `${fullStars}${emptyStars}`;
  };

  return (
    <div className="book-card">
      <Link to={`/books/${book._id || book.id}`}>
        <img src={book.coverImage || 'https://via.placeholder.com/190x260?text=Cover'} alt={book.title} />
      </Link>
      <div className="card-body">
        <Link to={`/books/${book._id || book.id}`} className="book-title">{book.title}</Link>
        <div className="book-author">{book.author}</div>
        <div className="book-rating">{renderStars(book.rating)}</div>
        <div className="book-price">₹{book.price}</div>
        <div className="card-actions">
          <button className="btn-primary" onClick={() => onAdd(book)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}