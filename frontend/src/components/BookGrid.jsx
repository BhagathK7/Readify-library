// frontend/src/components/BookGrid.jsx
import React from 'react';
import BookCard from './BookCard';

export default function BookGrid({ books, onAdd }) {
  if (!books || books.length === 0) {
    return <div>No books available.</div>;
  }

  return (
    <div className="book-grid">
      {books.map(book => (
        <BookCard key={book._id || book.id} book={book} onAdd={onAdd} />
      ))}
    </div>
  );
}