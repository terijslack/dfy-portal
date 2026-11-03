// routes/posts.js — Everything to do with posts for clients
// GET  /api/posts           → get all posts for the logged-in client (pulls fresh drafts from Metricool first)
// POST /api/posts/:id/approve        → client approves a post (puts it on the schedule in Metricool)
// POST /api/posts/:id/request-changes → client requests changes with notes

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { requireLogin } = require('../middleware/auth');
const { scheduleToMetricool, releasePost } = require('../services/metricool');
const { syncIfStale, syncClient, describeError } = require('../services/metricoolSync');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/posts — returns all posts for the logged-in client
router.get('/', requireLogin, async (req, res) => {
  try {
    // Pick up anything new or revised in Metricool (waits a few seconds at most)
    await syncIfStale(req.user.id);

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
  const seen = req.body && req.body.seen_updated_at; // when the client's copy was last changed

  try {
    // Re-check Metricool first, so we never schedule an older copy over an
    // edit DFY just made there. Never wait more than a few seconds.
    await Promise.race([
      syncClient(req.user.id).catch(err => console.error('Pre-approve sync failed:', describeError(err))),
      new Promise(resolve => setTimeout(resolve, 8000)),
    ]);

    // Fetch the post and make sure it belongs to this client — plus
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

    if (post.status !== 'pending' && post.status !== 'changes_requested') {
      return res.status(400).json({ error: 'This post has already been approved.' });
    }

    // Changed since they loaded the page → show them the new version first
    if (seen && post.updated_at && new Date(seen).getTime() !== new Date(post.updated_at).getTime()) {
      return res.status(409).json({ error: 'We just updated this post. Take a look at the new version, then approve.', refresh: true });
    }

    // Post written in Metricool (a draft there) → flip it to scheduled.
    // Post written in the portal → create it in Metricool.
    // Either way approval is recorded even if Metricool is down; a failed
    // Metricool draft hand-off is retried by the background sync.
    let metricoolPostId = post.metricool_post_id || null;
    let metricoolError = null;
    try {
      if (post.source === 'metricool' && post.metricool_raw) {
        await releasePost({ blogId: post.metricool_blog_id, raw: post.metricool_raw });
      } else {
        metricoolPostId = await scheduleToMetricool({
          text: post.caption, platform: post.platform, scheduledDate: post.scheduled_date,
          blogId: post.metricool_blog_id, timezone: post.timezone,
        });
      }
    } catch (mcErr) {
      metricoolError = describeError(mcErr);
      console.error('Metricool error (non-fatal):', metricoolError);
    }

    await pool.query(
      `UPDATE posts
       SET status = 'approved', metricool_post_id = $1, metricool_error = $2, updated_at = NOW()
       WHERE id = $3`,
      [metricoolPostId, metricoolError, postId]
    );

    res.json({
      success: true,
      message: 'Post approved!',
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

    if (!['pending', 'changes_requested'].includes(postResult.rows[0].status)) {
      return res.status(400).json({ error: 'This post is already approved. Message us and we can still change it.' });
    }

    await pool.query(
      `UPDATE posts 
       SET status = 'changes_requested', change_notes = $1, revised_at = NULL, updated_at = NOW()
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
