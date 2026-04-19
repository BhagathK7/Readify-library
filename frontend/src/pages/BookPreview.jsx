// frontend/src/pages/BookPreview.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJSON } from '../utils/api';
import { CartContext } from '../context/CartContext';

export default function BookPreview() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchJSON(`/books/${id}`);
        setBook(res);
      } catch (e) {
        console.error(e.message);
      }
    };
    load();
  }, [id]);

  if (!book) return <div>Loading...</div>;

  const handleBuyNow = () => {
    addToCart(book);
    navigate('/cart');
  };

  // Dummy sample text for the preview
  const sampleText = `
    "A beginning is the time for taking the most delicate care that the balances are correct."
    The old man sighed, closing the book. His grandson, who had been sitting patiently by his side, looked up with curiosity.
    "Grandpa, what did that mean?"
    The old man smiled, his eyes twinkling. "It means, my dear, that every story, every life, and every journey starts with a single, crucial step. And you must be very careful with that first step."
    He pointed to the cover of the book: "Dune."
    The boy's eyes widened. "Is this a new story for me?"
    "No," the old man said, a little sadly. "It's the oldest story of all."
    `;

  return (
    <div className="content-card book-preview-page">
      <div className="book-preview-header">
        <img src={book.coverImage || 'https://via.placeholder.com/200x300'} alt={book.title} />
        <div className="preview-info">
          <h2>{book.title}</h2>
          <div className="muted">By {book.author}</div>
          <div className="book-price">₹{book.price}</div>
          <button className="btn-primary" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
      <div className="book-sample-text">
        <p>{sampleText}</p>
        <div className="muted" style={{ marginTop: '20px', fontStyle: 'italic' }}>
          -- End of Sample --
        </div>
        <div className="buy-now-cta">
          <p>Like what you've read? Purchase the full book to continue the story!</p>
          <button className="btn-primary" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}