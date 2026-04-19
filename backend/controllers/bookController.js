// backend/controllers/bookController.js

const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');
const Review = require('../models/Review');
const Category = require('../models/Category');
const User = require('../models/User');
const ReadingChallenge = require('../models/ReadingChallenge');
const Order = require('../models/Order'); // Import Order model

// Create a book (admin) - UPDATED
exports.createBook = asyncHandler(async (req, res) => {
  const { title, author, description, content, price, category, stock, coverImage } = req.body;
  if (!title || !author || price == null) {
    res.status(400);
    throw new Error('Title, author and price are required');
  }
  let categoryDoc = null;
  if (category) {
    categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      categoryDoc = await Category.create({ name: category });
    }
  }
  const book = await Book.create({
    title,
    author,
    description,
    content: content || '', // ADDED content field
    price,
    category: categoryDoc?._id,
    stock: stock || 10,
    coverImage: coverImage || ''
  });
  res.status(201).json(book);
});

// Update a book (admin) - UPDATED
exports.updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  const updates = req.body;
  if (updates.category) {
    let categoryDoc = await Category.findOne({ name: updates.category });
    if (!categoryDoc) {
      categoryDoc = await Category.create({ name: updates.category });
    }
    updates.category = categoryDoc._id;
  }
  Object.assign(book, updates);
  await book.save();
  res.json(book);
});

// Delete book (admin)
exports.deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  await Book.deleteOne({ _id: book._id });
  res.json({ message: 'Book removed' });
});

// Get single book with reviews
exports.getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate({
    path: 'reviews',
    populate: { path: 'user', select: 'name' }
  }).populate('category').populate('publisher', 'name');
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  res.json(book);
});

// Get books with search & filters
exports.getBooks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const keyword = req.query.search
    ? {
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { author: { $regex: req.query.search, $options: 'i' } }
        ]
      }
    : {};

  const categoryFilter = {};
  if (req.query.category) {
    const cat = await Category.findOne({ name: req.query.category });
    if (cat) {
      categoryFilter.category = cat._id;
    } else {
      return res.json({ books: [], page, pages: 0, total: 0 });
    }
  }

  const queryObj = { ...keyword, ...categoryFilter };
  
  let mongoQuery = Book.find(queryObj).populate('category');

  if (req.query.sort === 'price_asc') mongoQuery = mongoQuery.sort({ price: 1 });
  else if (req.query.sort === 'price_desc') mongoQuery = mongoQuery.sort({ price: -1 });
  else mongoQuery = mongoQuery.sort({ createdAt: -1 });

  const total = await Book.countDocuments(queryObj);
  const books = await mongoQuery.skip(skip).limit(limit).exec();
  const pages = Math.ceil(total / limit);

  res.json({ books, page, pages, total });
});

// Add review
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.id;
  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  const existing = await Review.findOne({ user: req.user._id, book: bookId });
  if (existing) {
    res.status(400);
    throw new Error('You already reviewed this book');
  }
  const review = await Review.create({
    user: req.user._id,
    book: bookId,
    rating: Number(rating),
    comment: comment || ''
  });
  book.reviews.unshift(review._id);
  book.numReviews = await Review.countDocuments({ book: bookId });
  const agg = await Review.aggregate([
    { $match: { book: book._id } },
    { $group: { _id: '$book', avgRating: { $avg: '$rating' } } }
  ]);
  book.rating = agg?.[0]?.avgRating ? Number(agg[0].avgRating.toFixed(2)) : 0;
  await book.save();
  const populated = await Review.findById(review._id).populate('user', 'name');
  res.status(201).json(populated);
});

// Update a user's reading progress
exports.updateReadingProgress = asyncHandler(async (req, res) => {
  const { progress } = req.body;
  const bookId = req.params.id;
  const user = await User.findById(req.user._id).populate('readingChallenges');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const progressEntryIndex = user.readingProgress.findIndex(p => p.book.toString() === bookId);
  if (progressEntryIndex !== -1) {
    user.readingProgress[progressEntryIndex].progress = progress;
  } else {
    user.readingProgress.push({ book: bookId, progress });
  }

  const completedBooks = user.readingProgress.filter(p => p.progress >= 100).length;

  for (const challenge of user.readingChallenges) {
      if (challenge.unit === 'books') {
          challenge.currentProgress = completedBooks;
      }
      if (challenge.currentProgress >= challenge.target) {
          challenge.status = 'completed';
          challenge.completedAt = new Date();
      } else {
          challenge.status = 'active';
      }
      await challenge.save();
  }

  await user.save();
  res.json({ message: 'Reading progress updated successfully' });
});

// Get books published by the logged-in author
exports.getAuthorBooks = asyncHandler(async (req, res) => {
    const books = await Book.find({ publisher: req.user._id }).populate('category', 'name');
    res.json(books);
});

// Create a new book from the author portal
exports.createAuthorBook = asyncHandler(async (req, res) => {
    const { title, author, description, content, price, category, stock, coverImage } = req.body; // ADDED content
    if (!title || !author || price == null) {
      res.status(400);
      throw new Error('Title, author and price are required');
    }
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
        res.status(400);
        throw new Error('Invalid category name');
    }
    const book = await Book.create({
        title,
        author,
        description,
        content, // ADDED content
        price,
        category: categoryDoc._id,
        stock: stock || 10,
        coverImage: coverImage || '',
        publisher: req.user._id
    });
    res.status(201).json(book);
});

// Update a book from the author portal
exports.updateAuthorBook = asyncHandler(async (req, res) => {
    const book = await Book.findOne({ _id: req.params.id, publisher: req.user._id });
    if (!book) {
      res.status(404);
      throw new Error('Book not found or you are not the publisher');
    }
    const updates = req.body;
    if (updates.category) {
      const categoryDoc = await Category.findOne({ name: updates.category });
      if (!categoryDoc) {
        res.status(400);
        throw new Error('Invalid category name');
      }
      updates.category = categoryDoc._id;
    }
    Object.assign(book, updates);
    await book.save();
    res.json(book);
});

// Delete a book from the author portal
exports.deleteAuthorBook = asyncHandler(async (req, res) => {
    const book = await Book.findOne({ _id: req.params.id, publisher: req.user._id });
    if (!book) {
      res.status(404);
      throw new Error('Book not found or you are not the publisher');
    }
    await Book.deleteOne({ _id: book._id });
    res.json({ message: 'Book removed' });
});

// NEW FUNCTION: Get a purchased book's content
exports.getBookContent = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const userId = req.user._id;

  // Check if the user has purchased the book
  const order = await Order.findOne({ user: userId, 'items.book': bookId, isPaid: true });
  if (!order) {
    res.status(403); // Forbidden
    throw new Error('Access denied: Book not purchased');
  }

  // Get the book's content
  const book = await Book.findById(bookId).select('content');
  if (!book || !book.content) {
    res.status(404);
    throw new Error('Book content not found');
  }

  // Find the last read page for this user
  const user = await User.findById(userId).select('lastReadPage');
  const lastReadPage = user.lastReadPage.find(p => p.book.toString() === bookId)?.page || 1;

  res.json({ content: book.content, lastReadPage });
});

// NEW FUNCTION: Save the user's last read page
exports.saveLastReadPage = asyncHandler(async (req, res) => {
  const bookId = req.params.id;
  const { page } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const lastReadEntryIndex = user.lastReadPage.findIndex(p => p.book.toString() === bookId);

  if (lastReadEntryIndex !== -1) {
    user.lastReadPage[lastReadEntryIndex].page = page;
  } else {
    user.lastReadPage.push({ book: bookId, page });
  }

  await user.save();
  res.json({ message: 'Last read page saved successfully' });
});