// backend/controllers/adminController.js

const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Order = require('../models/Order');
const Book = require('../models/Book');
const Category = require('../models/Category');

exports.getStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const ordersCount = await Order.countDocuments();
  const booksCount = await Book.countDocuments();
  const totalSalesAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }
  ]);
  const totalSales = totalSalesAgg?.[0]?.totalSales || 0;

  const topBooksAgg = await Order.aggregate([
    { $unwind: '$items' },
    { $group: { _id: '$items.book', qtySold: { $sum: '$items.qty' } } },
    { $sort: { qtySold: -1 } },
    { $limit: 5 }
  ]);
  const topBooks = [];
  for (const tb of topBooksAgg) {
    const b = await Book.findById(tb._id);
    if (b) topBooks.push({ book: b.title, qtySold: tb.qtySold });
  }

  const categories = await Category.find().limit(10);

  res.json({ usersCount, ordersCount, booksCount, totalSales, topBooks, categories });
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name required');
  }
  const existing = await Category.findOne({ name });
  if (existing) {
    res.status(400);
    throw new Error('Category exists');
  }
  const category = await Category.create({ name, description: description || '' });
  res.status(201).json(category);
});

// NEW FUNCTION: Get all categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// NEW FUNCTION: Get all books (for admin management)
exports.getAdminBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().populate('category', 'name').sort({ createdAt: -1 });
  res.json(books);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status provided');
  }

  order.status = status;
  await order.save();

  res.json(order);
});