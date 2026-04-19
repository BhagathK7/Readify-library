// backend/models/ReadingChallenge.js

const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  target: { type: Number, required: true, default: 1 },
  unit: { type: String, enum: ['books', 'pages'], default: 'books' },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currentProgress: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model('ReadingChallenge', challengeSchema);