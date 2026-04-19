// backend/routes/bookRoutes.js

const express = require('express');
const router = express.Router();
const {
  createBook,
  updateBook,
  deleteBook,
  getBookById,
  getBooks,
  addReview,
  updateReadingProgress,
  getAuthorBooks,
  createAuthorBook,
  updateAuthorBook,
  deleteAuthorBook,
  getBookContent,
  saveLastReadPage
} = require('../controllers/bookController');
const { protect, admin, author } = require('../middleware/authMiddleware');

// public
router.get('/', getBooks);
router.get('/:id', getBookById);

// protected (for logged-in users)
router.get('/:id/content', protect, getBookContent); // NEW ROUTE
router.post('/:id/save-page', protect, saveLastReadPage); // NEW ROUTE
router.post('/:id/reviews', protect, addReview);
router.put('/:id/progress', protect, updateReadingProgress);

// author specific routes
router.get('/mybooks', protect, author, getAuthorBooks);
router.post('/mybooks', protect, author, createAuthorBook);
router.put('/mybooks/:id', protect, author, updateAuthorBook);
router.delete('/mybooks/:id', protect, author, deleteAuthorBook);

// admin only routes
router.post('/', protect, admin, createBook);
router.put('/:id', protect, admin, updateBook);
router.delete('/:id', protect, admin, deleteBook);

module.exports = router;