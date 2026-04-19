// backend/controllers/orderController.js

const asyncHandler = require('express-async-handler');
const { createClient } = require('../utils/razorpayClient');
const Order = require('../models/Order');
const Book = require('../models/Book');
const crypto = require('crypto');
const { sendEmail } = require('../utils/mailer');
const User = require('../models/User');

// Create an order and return Razorpay order id & amount
exports.createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;
  if (!items || !items.length) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  // compute totals
  let itemsPrice = 0;
  const orderItems = [];
  for (const it of items) {
    const book = await Book.findById(it.book);
    if (!book) {
      res.status(400);
      throw new Error('Invalid book in cart');
    }
    if (book.stock < it.qty) {
      res.status(400);
      throw new Error(`Not enough stock for ${book.title}`);
    }
    orderItems.push({
      book: book._id,
      title: book.title,
      qty: it.qty,
      price: book.price,
      coverImage: book.coverImage
    });
    itemsPrice += book.price * it.qty;
  }
  const shippingPrice = 0; // simple
  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    status: 'pending'
  });

  const razorpay = createClient();
  const options = {
    amount: Math.round(totalPrice * 100),
    currency: 'INR',
    receipt: `order_rcpt_${order._id}`,
    payment_capture: 1
  };
  const razorpayOrder = await razorpay.orders.create(options);

  order.payment = order.payment || {};
  order.payment.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.json({
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: options.amount,
    currency: options.currency,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID
  });
});

// Verify payment and finalize order
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  if (!orderId) {
    res.status(400);
    throw new Error('Missing orderId');
  }
  const order = await Order.findById(orderId).populate('user');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.payment.razorpayPaymentId = razorpayPaymentId;
  order.payment.razorpaySignature = razorpaySignature;
  order.status = 'processing';
  await order.save();

  for (const item of order.items) {
    const book = await Book.findById(item.book);
    if (book) {
      book.stock = Math.max(0, book.stock - item.qty);
      await book.save();
    }
  }

  try {
    await sendEmail({
      to: order.user.email,
      subject: `Order confirmed - Libertine #${order._id}`,
      text: `Thank you for your order. Order ID: ${order._id}. Total: ₹${order.totalPrice}`,
      html: `<p>Hi ${order.user.name},</p><p>Thanks for your order. Order ID: ${order._id}. Total: ₹${order.totalPrice}</p>`
    });
  } catch (e) {
    console.error('Failed to send email', e.message);
  }

  res.json({ message: 'Payment verified and order completed', order });
});

// NEW: Get user orders with populated book details - FIXED
exports.getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.book') // This is the crucial fix
    .sort({ createdAt: -1 });
  res.json({ orders });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('items.book');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});