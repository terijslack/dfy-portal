// routes/posts.js — Everything to do with posts for clients
// GET  /api/posts           → get all posts for the logged-in client
// POST /api/posts/:id/approve        → client approves a post (schedules it in Metricool)
// POST /api/posts/:id/request-changes → client requests changes with notes

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { requireLogin } = require('../middleware/auth');
const { scheduleToMetricool } = require('../services/metricool');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/posts — returns all posts for the logged-in client
router.get('/', requireLogin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM posts 
       WHERE client_id = $1 
       ORDER BY scheduled_date ASC`,
      [req.user.id]
    );

    res.json({ posts: result.rows });
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ error: 'Could not load posts.' });
  }
});

// POST /api/posts/:id/approve — client approves a post
router.post('/:id/approve', requireLogin, async (req, res) => {
  const postId = req.params.id;

  try {
    // First, fetch the post and make sure it belongs to this client — plus
    // what we need to schedule it in Metricool (their brand id, their timezone)
    const postResult = await pool.query(
      `SELECT p.*, c.metricool_blog_id, o.timezone
       FROM posts p
       JOIN clients c ON c.id = p.client_id
       LEFT JOIN client_onboarding o ON o.client_id = p.client_id
       WHERE p.id = $1 AND p.client_id = $2`,
      [postId, req.user.id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const post = postResult.rows[0];

    // Schedule it in Metricool. Quietly skipped if Metricool isn't configured
    // yet for this client — approving a post never depends on this working.
    let metricoolPostId = null;
    try {
      metricoolPostId = await scheduleToMetricool({
        text: post.caption, platform: post.platform, scheduledDate: post.scheduled_date,
        blogId: post.metricool_blog_id, timezone: post.timezone,
      });
    } catch (mcErr) {
      console.error('Metricool error (non-fatal):', mcErr.response?.data || mcErr.message);
      // We still mark as approved even if Metricool fails — you can schedule it there by hand
    }

    // Update status in the database
    await pool.query(
      `UPDATE posts
       SET status = 'approved', metricool_post_id = $1, updated_at = NOW()
       WHERE id = $2`,
      [metricoolPostId, postId]
    );

    res.json({
      success: true,
      message: metricoolPostId ? 'Post approved and scheduled in Metricool!' : 'Post approved!',
    });

  } catch (err) {
    console.error('Approve error:', err);
    res.status(500).json({ error: 'Could not approve post.' });
  }
});

// POST /api/posts/:id/request-changes — client requests changes
router.post('/:id/request-changes', requireLogin, async (req, res) => {
  const postId = req.params.id;
  const { notes } = req.body;

  if (!notes || notes.trim() === '') {
    return res.status(400).json({ error: 'Please include notes about what you want changed.' });
  }

  try {
    // Make sure the post belongs to this client
    const postResult = await pool.query(
      'SELECT * FROM posts WHERE id = $1 AND client_id = $2',
      [postId, req.user.id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    await pool.query(
      `UPDATE posts 
       SET status = 'changes_requested', change_notes = $1, updated_at = NOW()
       WHERE id = $2`,
      [notes.trim(), postId]
    );

    res.json({ success: true, message: 'Change request sent!' });

  } catch (err) {
    console.error('Request changes error:', err);
    res.status(500).json({ error: 'Could not submit changes.' });
  }
});

module.exports = router;
