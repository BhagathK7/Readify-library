// backend/controllers/authController.js

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ReadingChallenge = require('../models/ReadingChallenge');

// Create token and set httpOnly cookie
const createTokenCookie = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
  const secure = process.env.COOKIE_SECURE === 'true';
  res.cookie('token', token, {
    httpOnly: true,
    secure: secure,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
  });
};

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password });
  createTokenCookie(res, user);
  res.status(201).json({ user: user.toJSON() });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  createTokenCookie(res, user);
  res.json({ user: user.toJSON() });
});

exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', { httpOnly: true });
  res.json({ message: 'Logged out' });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ user: user.toJSON() });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const { name, email, password } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  await user.save();
  res.json({ user: user.toJSON() });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { bookId } = req.body;

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isBookInWishlist = user.wishlist.includes(bookId);

  if (isBookInWishlist) {
    user.wishlist.pull(bookId);
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json({ user: updatedUser.toJSON(), message: 'Book removed from wishlist' });
  } else {
    user.wishlist.push(bookId);
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.json({ user: updatedUser.toJSON(), message: 'Book added to wishlist' });
  }
});

exports.getReadingChallenges = asyncHandler(async (req, res) => {
  const challenges = await ReadingChallenge.find({ user: req.user._id });
  res.json(challenges);
});

// NEW FUNCTION: Create a new reading challenge
exports.createReadingChallenge = asyncHandler(async (req, res) => {
  const { title, description, target, unit } = req.body;
  if (!title || !target || !unit) {
    res.status(400);
    throw new Error('Please provide title, target, and unit for the challenge');
  }

  const newChallenge = await ReadingChallenge.create({
    title,
    description: description || 'No description provided.',
    target,
    unit,
    user: req.user._id,
  });

  const user = await User.findById(req.user._id);
  user.readingChallenges.push(newChallenge._id);
  await user.save();

  res.status(201).json(newChallenge);
});