// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, token missing');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token invalid');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else {
    res.status(403);
    throw new Error('Require admin role');
  }
};

// NEW: Middleware to check for author role
const author = (req, res, next) => {
  if (req.user && req.user.role === 'author') next();
  else {
    res.status(403);
    throw new Error('Require author role');
  }
};

module.exports = { protect, admin, author };