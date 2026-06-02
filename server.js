// server.js — The main entry point for the app
// This sets up Express, connects all the routes, and starts listening for requests

require('dotenv').config(); // load .env variables first thing

const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ───────────────────────────────────────────────
// These run on every request before hitting the routes

app.use(express.json()); // lets us read JSON request bodies
app.use(express.urlencoded({ extended: true })); // lets us read form data
app.use(cookieParser()); // lets us read cookies (used for the auth token)

// Prevent browsers from caching HTML pages so updates show immediately
app.use((req, res, next) => {
  if (req.path.endsWith('.html') || !req.path.includes('.')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

// Serve everything in frontend/public as static files
// This is what your clients actually see in their browser
app.use(express.static(path.join(__dirname, 'frontend/public')));

// ─── API ROUTES ───────────────────────────────────────────────
// All API endpoints live under /api/

app.use('/api/auth', require('./backend/routes/auth'));     // login, logout, /me
app.use('/api/posts', require('./backend/routes/posts'));   // client post actions
app.use('/api/admin', require('./backend/routes/admin'));   // admin-only actions
app.use('/api/stripe', require('./backend/routes/stripe')); // stripe checkout + webhooks
app.use('/api/account', require('./backend/routes/account')); // subscription management
app.use('/api/onboarding', require('./backend/routes/onboarding')); // client intake form
app.use('/api/contact', require('./backend/routes/contact'));       // public contact form
app.use('/api/socials', require('./backend/routes/socials'));       // social account connections

// ─── FRONTEND CATCH-ALL ───────────────────────────────────────
// For any URL that isn't an API route, send the appropriate HTML file
// This lets clients go to /dashboard and get dashboard.html

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/login.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/dashboard.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/admin.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/signup.html'));
});

app.get('/create-account', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/create-account.html'));
});

app.get('/signup-success', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/signup-success.html'));
});

app.get('/payment-success', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/payment-success.html'));
});

app.get('/posts', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/posts.html'));
});

app.get('/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/calendar.html'));
});

app.get('/gbp', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/gbp.html'));
});

app.get('/socials', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/socials.html'));
});

app.get('/analytics', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/analytics.html'));
});

app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/account.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/contact.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/profile.html'));
});

app.get('/onboarding', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/onboarding.html'));
});

app.get('/landing', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/landing.html'));
});

// Anything else → send to the login page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/login.html'));
});

// ─── START SERVER ─────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`   Open: http://localhost:${PORT}`);
});
