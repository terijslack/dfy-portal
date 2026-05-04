// middleware/auth.js — Checks if a user is logged in before letting them access a route
// This runs BEFORE route handlers that need protection

const jwt = require('jsonwebtoken');

// requireLogin: blocks access if not logged in
// Add this to any route that needs a logged-in user
function requireLogin(req, res, next) {
  // Look for the token in a cookie (set at login)
  const token = req.cookies?.token;

  if (!token) {
    // No token = not logged in
    return res.status(401).json({ error: 'Please log in to access this.' });
  }

  try {
    // Verify the token is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to the request so routes can use it
    next(); // all good — continue to the actual route handler
  } catch (err) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
}

// requireAdmin: blocks access if not an admin (i.e. not you)
// Add this to admin-only routes
function requireAdmin(req, res, next) {
  requireLogin(req, res, () => {
    if (!req.user.is_admin) {
      return res.status(403).json({ error: 'Admin access only.' });
    }
    next();
  });
}

module.exports = { requireLogin, requireAdmin };
