// routes/admin.js — Admin-only routes (only you can access these)
// GET  /api/admin/clients          → list all clients and their post stats
// GET  /api/admin/clients/:id/posts → get all posts for a specific client
// POST /api/admin/posts            → create a new post for a client
// PUT  /api/admin/posts/:id        → edit a post (e.g. after client requests changes)
// DELETE /api/admin/posts/:id      → delete a post

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { requireAdmin } = require('../middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// GET /api/admin/clients — list all clients with their post counts
router.get('/clients', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        c.id, c.name, c.email, c.business_name, c.created_at,
        COUNT(p.id) AS total_posts,
        COUNT(CASE WHEN p.status = 'pending' THEN 1 END) AS pending,
        COUNT(CASE WHEN p.status = 'approved' THEN 1 END) AS approved,
        COUNT(CASE WHEN p.status = 'changes_requested' THEN 1 END) AS changes_requested
      FROM clients c
      LEFT JOIN posts p ON p.client_id = c.id
      WHERE c.is_admin = false
      GROUP BY c.id
      ORDER BY c.name
    `);

    res.json({ clients: result.rows });
  } catch (err) {
    console.error('Admin get clients error:', err);
    res.status(500).json({ error: 'Could not load clients.' });
  }
});

// GET /api/admin/clients/:id/posts — get all posts for one specific client
router.get('/clients/:id/posts', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE client_id = $1 ORDER BY scheduled_date ASC',
      [req.params.id]
    );

    res.json({ posts: result.rows });
  } catch (err) {
    console.error('Admin get posts error:', err);
    res.status(500).json({ error: 'Could not load posts.' });
  }
});

// POST /api/admin/posts — create a new post for a client
router.post('/posts', requireAdmin, async (req, res) => {
  const { client_id, caption, platform, scheduled_date } = req.body;

  if (!client_id || !caption || !platform || !scheduled_date) {
    return res.status(400).json({ error: 'client_id, caption, platform, and scheduled_date are all required.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO posts (client_id, caption, platform, scheduled_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [client_id, caption, platform, scheduled_date]
    );

    res.json({ success: true, post: result.rows[0] });
  } catch (err) {
    console.error('Admin create post error:', err);
    res.status(500).json({ error: 'Could not create post.' });
  }
});

// PUT /api/admin/posts/:id — edit a post (after client requests changes)
router.put('/posts/:id', requireAdmin, async (req, res) => {
  const { caption, platform, scheduled_date, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE posts 
       SET caption = COALESCE($1, caption),
           platform = COALESCE($2, platform),
           scheduled_date = COALESCE($3, scheduled_date),
           status = COALESCE($4, status),
           change_notes = NULL,
           updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [caption, platform, scheduled_date, status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.json({ success: true, post: result.rows[0] });
  } catch (err) {
    console.error('Admin update post error:', err);
    res.status(500).json({ error: 'Could not update post.' });
  }
});

// DELETE /api/admin/posts/:id — delete a post
router.delete('/posts/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin delete post error:', err);
    res.status(500).json({ error: 'Could not delete post.' });
  }
});

module.exports = router;
