// frontend/src/pages/AuthorDashboard.jsx

import React, { useState, useEffect } from 'react';
import { fetchJSON } from '../utils/api';
import AuthorBookForm from '../components/AuthorBookForm';

export default function AuthorDashboard() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);

  const loadData = async () => {
    try {
      const [booksRes, categoriesRes] = await Promise.all([
        fetchJSON('/books/mybooks'),
        fetchJSON('/admin/categories')
      ]);
      setBooks(booksRes);
      setCategories(categoriesRes);
    } catch (e) {
      console.error('Failed to load author books:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }
    try {
      await fetchJSON(`/books/mybooks/${bookId}`, { method: 'DELETE' });
      alert('Book deleted successfully!');
      loadData();
    } catch (e) {
      alert('Failed to delete book: ' + e.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="author-dashboard-page">
      <h2>My Books</h2>
      <div className="book-management-container">
        <AuthorBookForm 
          bookToEdit={editingBook}
          onComplete={() => { setEditingBook(null); loadData(); }}
          categories={categories}
        />
        <div className="book-list-card">
          <h3>My Published Books</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>₹{book.price}</td>
                    <td>{book.category?.name || 'N/A'}</td>
                    <td className="table-actions">
                      <button className="btn-ghost" onClick={() => setEditingBook(book)}>Edit</button>
                      <button className="btn-ghost" onClick={() => handleDelete(book._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}