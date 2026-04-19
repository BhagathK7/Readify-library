// backend/utils/razorpayClient.js
const Razorpay = require('razorpay');

const createClient = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

module.exports = { createClient };
