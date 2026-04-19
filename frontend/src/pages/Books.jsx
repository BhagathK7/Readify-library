// frontend/src/pages/Books.jsx
import React, { useEffect, useState, useContext } from 'react';
import { fetchJSON } from '../utils/api';
import BookGrid from '../components/BookGrid';
import { CartContext } from '../context/CartContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);

  // ✅ CHANGED: now supports multiple categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  const navigate = useNavigate();

  // ✅ Fetch books (updated for multiple filters)
  const fetchBooks = async (categories = [], search = '') => {
    try {
      setLoading(true);

      const categoryQuery = categories.length
        ? `&category=${categories.map(c => encodeURIComponent(c)).join(',')}`
        : '';

      const searchQuery = search
        ? `&search=${encodeURIComponent(search)}`
        : '';

      const res = await fetchJSON(
        `/books?limit=30${categoryQuery}${searchQuery}`
      );

      setBooks(res.books || []);
    } catch (e) {
      console.error('Failed to fetch books:', e.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Init from URL
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchJSON('/admin/categories');
        setCategories(res || []);
      } catch (e) {
        console.error('Failed to fetch categories:', e.message);
        setCategories([]);
      }
    };

    fetchCategories();

    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    const initialCategories = categoryParam ? categoryParam.split(',') : [];

    setSelectedCategories(initialCategories);
    fetchBooks(initialCategories, searchParam);
  }, [searchParams]);

  // ✅ Toggle multiple filters
  const handleFilterChange = (categoryName) => {
    let updatedCategories;

    if (selectedCategories.includes(categoryName)) {
      updatedCategories = selectedCategories.filter(c => c !== categoryName);
    } else {
      updatedCategories = [...selectedCategories, categoryName];
    }

    const newParams = new URLSearchParams(searchParams);

    if (updatedCategories.length) {
      newParams.set('category', updatedCategories.join(','));
    } else {
      newParams.delete('category');
    }

    navigate(`/books?${newParams.toString()}`);
  };

  const handleReset = () => {
    navigate('/books');
  };

  return (
    <div className="books-layout">
      {/* Sidebar */}
      <div className="filter-sidebar">
        <h3>Advanced Filters</h3>

        <div className="filter-group">
          <label>Genre</label>

          {categories.map((cat) => (
            <div key={cat._id} className="filter-option">
              <span>{cat.name}</span>

              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)} // ✅ FIXED
                  onChange={() => handleFilterChange(cat.name)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>

        <div className="filter-actions">
          <button className="btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="books-main-content">
        <div className="flex-header">
          <h2>Browse All Books</h2>
        </div>

        {loading ? (
          <div>Loading books...</div>
        ) : books.length > 0 ? (
          <BookGrid books={books} onAdd={addToCart} />
        ) : (
          <div className="muted">No books found.</div>
        )}
      </div>
    </div>
  );
}