// backend/server.js

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/db');

// ✅ Import routes (ONLY ONCE each)
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

// ✅ Import error handler
const errorHandler = require('./middleware/errorMiddleware');

const app = express(); // ✅ MUST be before app.use
const PORT = process.env.PORT || 5000;

// ✅ Connect to DB
connectDB(process.env.MONGO_URI);

// ✅ Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS config
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes); // ✅ Correct placement
app.use('/api/admin', adminRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send({ message: 'Readify API is running' });
});

// ✅ Error handler (must be last)
app.use(errorHandler);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});