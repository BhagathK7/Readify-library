// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile, toggleWishlist, getReadingChallenges, createReadingChallenge } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Wishlist routes
router.post('/wishlist', protect, toggleWishlist);

// Reading challenges routes
router.get('/challenges', protect, getReadingChallenges);
router.post('/challenges', protect, createReadingChallenge); // NEW POST ROUTE

module.exports = router;