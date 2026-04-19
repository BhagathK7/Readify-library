// frontend/src/pages/BookReader.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJSON } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../App';

const PAGE_SIZE = 1500; // Characters per page

export default function BookReader() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageContent, setPageContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const { isDarkTheme } = useContext(ThemeContext);

  const loadBookContent = async () => {
    setLoading(true);
    try {
      const res = await fetchJSON(`/books/${id}/content`);
      setBook(res.book);

      const content = res.content || '';
      const pages = [];
      for (let i = 0; i < content.length; i += PAGE_SIZE) {
        pages.push(content.substring(i, i + PAGE_SIZE));
      }
      setPageContent(pages);
      setTotalPages(pages.length);
      setCurrentPage(res.lastReadPage || 1);

    } catch (e) {
      console.error('Failed to load book content:', e);
      alert('Failed to load book content. Please ensure you have purchased this book.');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    try {
      await fetchJSON(`/books/${id}/save-page`, {
        method: 'POST',
        body: JSON.stringify({ page: newPage })
      });
    } catch (e) {
      console.error('Failed to save last read page:', e);
    }
  };

  useEffect(() => {
    loadBookContent();
  }, [id]);

  if (loading || !book) {
    return <div>Loading reader...</div>;
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <div className={`book-reader-page ${isDarkTheme ? 'dark' : ''}`}>
      <div className="reader-header">
        <h2>{book.title}</h2>
        <div className="page-indicator">{currentPage} / {totalPages}</div>
      </div>
      <div className="reader-content">
        <p>{pageContent[currentPage - 1]}</p>
      </div>
      <div className="reader-controls">
        <button className="btn-secondary" onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        <button className="btn-primary" onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
}