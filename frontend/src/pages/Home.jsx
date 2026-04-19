// frontend/src/pages/Home.jsx
import React, { useEffect, useState, useContext } from 'react';
import { fetchJSON } from '../utils/api';
import BookGrid from '../components/BookGrid';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async (category = null) => {
    try {
      setLoading(true);
      const query = category ? `&category=${encodeURIComponent(category)}` : '';
      const res = await fetchJSON(`/books?limit=12${query}`);
      setBooks(res.books);
    } catch (e) {
      console.error(e.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchJSON('/admin/categories');
        setCategories(res);
      } catch (e) {
        console.error(e.message);
        setCategories([]);
      }
    };
    fetchCategories();
    fetchBooks();
  }, []);

  const handleFilterChange = (categoryName) => {
    const newCategory = selectedCategory === categoryName ? null : categoryName;
    setSelectedCategory(newCategory);
    fetchBooks(newCategory);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    fetchBooks();
  };

  return (
    <div className="home-layout">
      <div className="filter-sidebar">
        <h3>Advanced Filters</h3>
        <div className="filter-group">
          <label>Genre</label>
          {categories.map(cat => (
            <div key={cat._id} className="filter-option">
              <span>{cat.name}</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={selectedCategory === cat.name}
                  onChange={() => handleFilterChange(cat.name)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>
        <div className="filter-actions">
          <button className="btn-secondary" onClick={handleReset}>Reset</button>
        </div>
      </div>
      <div className="home-main-content">
        <div className="flex-header">
          <h2>Your Reading Journey</h2>
          <div className="flex-row">
            <Link to="/books" className="btn-ghost">View All</Link>
            <button className="btn-primary">Quick Add</button>
          </div>
        </div>
        {loading ? (
          <div>Loading books...</div>
        ) : books.length > 0 ? (
          <BookGrid books={books} onAdd={addToCart} />
        ) : (
          <div className="muted">No books found in your journey.</div>
        )}
      </div>
    </div>
  );
}