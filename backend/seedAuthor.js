// readify/backend/seedAuthor.js

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const run = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const authorEmail = process.env.SEED_AUTHOR_EMAIL || 'author@readify.local';
    const authorPassword = process.env.SEED_AUTHOR_PASSWORD || 'Author@123';
    const existingAuthor = await User.findOne({ email: authorEmail });

    if (existingAuthor) {
      console.log('Author already exists:', existingAuthor.email);
      process.exit(0);
    }
    
    const created = await User.create({
      name: 'Readify Author',
      email: authorEmail,
      password: authorPassword,
      role: 'author'
    });

    console.log('Author user created:', created.email);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding author:', err);
    process.exit(1);
  }
};

run();