// middleware/auth.js — Checks if a user is logged in before letting them access a route

const jwt  = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// requireLogin: blocks access if not logged in, or if plan is pending/cancelled/paused.
// Admins always pass through regardless of status.
async function requireLogin(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Please log in to access this.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  // Admins always pass through — no status check needed
  if (decoded.is_admin) {
    req.user = decoded;
    return next();
  }

  // For regular clients: check current status from DB so changes take effect immediately
  try {
    const result = await pool.query(
      'SELECT status, subscription_status FROM clients WHERE id = $1',
      [decoded.id]
    );
    const row = result.rows[0];

    if (!row) {
      return res.status(401).json({ error: 'Account not found.' });
    }

    if (row.status === 'pending') {
      return res.status(403).json({
        error: "Your payment hasn't been completed yet. Please finish checkout to start your plan.",
        code:  'pending',
      });
    }

    if (row.subscription_status === 'cancelled') {
      return res.status(403).json({
        error:    "Your plan has ended. Contact us to start a new one.",
        code:     'cancelled',
        redirect: '/plan-ended',
      });
    }
  } catch (dbErr) {
    // If the DB is unreachable, fail open so a DB hiccup doesn't lock everyone out
    console.error('[requireLogin] DB status check failed:', dbErr.message);
  }

  req.user = decoded;
  next();
}

// requireAdmin: blocks access if not an admin (i.e. not you)
function requireAdmin(req, res, next) {
  requireLogin(req, res, () => {
    if (!req.user.is_admin) {
      return res.status(403).json({ error: 'Admin access only.' });
    }
    next();
  });
}

module.exports = { requireLogin, requireAdmin };
