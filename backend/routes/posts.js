// routes/posts.js — Everything to do with posts for clients
// GET  /api/posts           → get all posts for the logged-in client
// POST /api/posts/:id/approve        → client approves a post (sends to Buffer)
// POST /api/posts/:id/request-changes → client requests changes with notes

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const axios = require('axios');
const { requireLogin } = require('../middleware/auth');

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
    // First, fetch the post and make sure it belongs to this client
    const postResult = await pool.query(
      'SELECT * FROM posts WHERE id = $1 AND client_id = $2',
      [postId, req.user.id]
    );

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    const post = postResult.rows[0];

    // Send to Buffer
    let bufferPostId = null;
    try {
      bufferPostId = await sendToBuffer(post);
    } catch (bufferErr) {
      console.error('Buffer error (non-fatal):', bufferErr.message);
      // We still mark as approved even if Buffer fails — you can re-queue manually
    }

    // Update status in the database
    await pool.query(
      `UPDATE posts 
       SET status = 'approved', buffer_post_id = $1, updated_at = NOW()
       WHERE id = $2`,
      [bufferPostId, postId]
    );

    res.json({ success: true, message: 'Post approved and sent to Buffer!' });

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

// Helper function: sends a post to Buffer
async function sendToBuffer(post) {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  const profileIds = process.env.BUFFER_PROFILE_IDS?.split(',').map(id => id.trim()) || [];

  if (!token || profileIds.length === 0) {
    throw new Error('Buffer not configured');
  }

  // Buffer API: create a scheduled post
  const response = await axios.post(
    'https://api.bufferapp.com/1/updates/create.json',
    new URLSearchParams({
      access_token: token,
      text: post.caption,
      'profile_ids[]': profileIds[0], // use first profile — customize as needed
      scheduled_at: new Date(post.scheduled_date).toISOString(),
      now: false
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  return response.data?.updates?.[0]?.id || null;
}

module.exports = router;
