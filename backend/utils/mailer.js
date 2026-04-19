// backend/utils/mailer.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = parseInt(process.env.EMAIL_PORT || '587', 10);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Readify" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });
};

module.exports = { sendEmail };
