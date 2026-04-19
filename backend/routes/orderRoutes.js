// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getUserOrders, getOrderById } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/myorders', protect, getUserOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
