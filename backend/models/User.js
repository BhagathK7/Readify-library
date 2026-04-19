// backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'author'], default: 'user' },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  readingProgress: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    progress: { type: Number, min: 0, max: 100, default: 0 }
  }],
  lastReadPage: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    page: { type: Number, default: 1 }
  }],
  readingChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReadingChallenge' }],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Do not expose password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);