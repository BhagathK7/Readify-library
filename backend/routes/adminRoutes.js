// backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getStats, getUsers, getOrders, createCategory, updateOrderStatus, getCategories, getAdminBooks } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getUsers);
router.get('/orders', protect, admin, getOrders);
router.post('/categories', protect, admin, createCategory);
router.get('/categories', getCategories);

// NEW ROUTE: Get all books for admin
router.get('/books', protect, admin, getAdminBooks);

router.put('/orders/:id/status', protect, admin, updateOrderStatus);

module.exports = router;