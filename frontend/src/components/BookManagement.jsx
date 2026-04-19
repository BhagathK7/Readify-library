// frontend/src/components/BookManagement.jsx

import React, { useState, useEffect } from 'react';
import { fetchJSON } from '../utils/api';
import './BookManagement.css'; 

export default function BookManagement() {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBook, setCurrentBook] = useState({
        title: '',
        author: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        coverImage: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const [booksRes, categoriesRes] = await Promise.all([
                fetchJSON('/admin/books'),
                fetchJSON('/admin/categories')
            ]);
            setBooks(booksRes);
            setCategories(categoriesRes);
        } catch (e) {
            console.error('Failed to load data:', e);
            alert('Failed to load books and categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentBook(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = (book) => {
        setIsEditing(true);
        setCurrentBook({
            ...book,
            category: book.category?.name || ''
        });
    };

    const handleDelete = async (bookId) => {
        if (!window.confirm('Are you sure you want to delete this book?')) {
            return;
        }
        try {
            await fetchJSON(`/books/${bookId}`, { method: 'DELETE' });
            alert('Book deleted successfully!');
            loadData(); // Reload data after successful deletion
        } catch (e) {
            alert('Failed to delete book.');
        }
    };

    const handleCreateUpdate = async (e) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/books/${currentBook._id}` : '/books';
        try {
            await fetchJSON(url, {
                method,
                body: JSON.stringify(currentBook)
            });
            alert(`Book ${isEditing ? 'updated' : 'created'} successfully!`);
            setIsEditing(false);
            setCurrentBook({
                title: '',
                author: '',
                description: '',
                price: 0,
                category: '',
                stock: 0,
                coverImage: ''
            });
            loadData(); // Reload data
        } catch (e) {
            alert(`Failed to ${isEditing ? 'update' : 'create'} book.`);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="content-card book-management-container">
            <div className="book-form-card">
                <h3>{isEditing ? 'Edit Book' : 'Add New Book'}</h3>
                <form onSubmit={handleCreateUpdate}>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={currentBook.title} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Author</label>
                        <input type="text" name="author" value={currentBook.author} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={currentBook.description} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input type="number" name="price" value={currentBook.price} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={currentBook.category} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Stock</label>
                        <input type="number" name="stock" value={currentBook.stock} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Cover Image URL</label>
                        <input type="text" name="coverImage" value={currentBook.coverImage} onChange={handleChange} />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">{isEditing ? 'Update Book' : 'Add Book'}</button>
                        {isEditing && (
                            <button type="button" className="btn-secondary" onClick={() => { setIsEditing(false); setCurrentBook({ title: '', author: '', description: '', price: 0, category: '', stock: 0, coverImage: '' }); }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
            
            <div className="book-list-card">
                <h3>Current Books</h3>
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
                                    <td>
                                        <button className="btn-ghost" onClick={() => handleEdit(book)}>Edit</button>
                                        <button className="btn-ghost" onClick={() => handleDelete(book._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}