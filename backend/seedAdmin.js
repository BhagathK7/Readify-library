// backend/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const run = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@readify.local';
    const admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log('Admin already exists:', adminEmail);
      process.exit(0);
    }
    const created = await User.create({
      name: 'Readify Admin',
      email: adminEmail,
      password: process.env.SEED_ADMIN_PASSWORD || 'Admin@123',
      role: 'admin'
    });
    console.log('Admin user created:', created.email);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

run();
