// frontend/src/components/AuthorBookForm.jsx
import React, { useState, useEffect } from 'react';
import { fetchJSON } from '../utils/api';

export default function AuthorBookForm({ bookToEdit, onComplete, categories }) {
    const [book, setBook] = useState({
        title: '',
        author: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        coverImage: ''
    });
    const [loading, setLoading] = useState(false);
    const isEditing = !!bookToEdit;

    useEffect(() => {
        if (isEditing) {
            setBook({
                ...bookToEdit,
                category: bookToEdit.category?.name || ''
            });
        }
    }, [bookToEdit, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `/books/mybooks/${bookToEdit._id}` : '/books/mybooks';
            await fetchJSON(url, {
                method,
                body: JSON.stringify(book)
            });
            alert(`Book ${isEditing ? 'updated' : 'added'} successfully!`);
            onComplete();
        } catch (error) {
            alert('Failed to save book: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="book-form-card">
            <h3>{isEditing ? 'Edit Book' : 'Add New Book'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={book.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Author</label>
                    <input type="text" name="author" value={book.author} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" value={book.description} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input type="number" name="price" value={book.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={book.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Stock</label>
                    <input type="number" name="stock" value={book.stock} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label>Cover Image URL</label>
                    <input type="text" name="coverImage" value={book.coverImage} onChange={handleChange} />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : (isEditing ? 'Update Book' : 'Add Book')}
                    </button>
                    {isEditing && (
                        <button type="button" className="btn-secondary" onClick={() => onComplete()}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}