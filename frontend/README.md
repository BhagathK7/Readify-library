# Readify — MERN Stack Digital Library & Bookstore

## Overview
Readify is a demo MERN application (React + Vite frontend, Node/Express backend, MongoDB) including:
- Authentication with JWT via httpOnly cookies
- Browse books, search, view details & reviews
- Cart & checkout with Razorpay integration
- Admin endpoints for management
- Nodemailer order confirmation

This repo includes both backend and frontend in `backend/` and `frontend/`.

---

## Prerequisites
- Node.js >= 18
- MongoDB (local or cloud)
- A Razorpay account (for real payments) — you can use test keys
- SMTP credentials for sending emails (or use Mailtrap for testing)

---

## Environment Variables

Create `backend/.env` with:

