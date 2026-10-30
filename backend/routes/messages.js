// routes/messages.js — Messages from DFY that show on a client's dashboard
// ("From your marketing team"), and the client's answers.
// GET  /api/messages              → messages they haven't answered yet, newest first
// POST /api/messages/:id/respond  → { answer: 'yes'|'no'|'ok', reply?: string }
//
// DFY sends these from Admin → Accounts → the client → Activity. Every answer
// also goes on that account's timeline so it's visible in the admin.

const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const { pool } = require('../services/crm');
const { logForClient } = require('../services/activity');

const short = (s, n = 90) => { s = String(s || '').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const ANSWER_WORDS = { yes: 'Yes', no: 'Not this time', ok: 'Got it' };

router.get('/', requireLogin, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT id, body, ask, created_at FROM client_messages
       WHERE client_id = $1 AND responded_at IS NULL
       ORDER BY created_at DESC LIMIT 10`,
      [req.user.id]
    );
    res.json({ messages: r.rows });
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ error: 'Could not load messages.' });
  }
});

router.post('/:id/respond', requireLogin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const answer = (req.body || {}).answer;
  const reply = typeof req.body?.reply === 'string' ? req.body.reply.trim().slice(0, 2000) || null : null;
  if (!id) return res.status(400).json({ error: 'Invalid message.' });
  if (!ANSWER_WORDS[answer]) return res.status(400).json({ error: 'Invalid answer.' });

  try {
    const r = await pool.query(
      `UPDATE client_messages SET response = $3, reply = $4, responded_at = NOW()
       WHERE id = $1 AND client_id = $2 AND responded_at IS NULL
         AND (CASE WHEN ask THEN $3 IN ('yes', 'no') ELSE $3 = 'ok' END)
       RETURNING body, ask`,
      [id, req.user.id, answer, reply]
    );
    if (!r.rows.length) return res.status(404).json({ error: 'That message isn\'t waiting on an answer anymore. Refresh the page.' });
    res.json({ success: true });

    const m = r.rows[0];
    const verb = m.ask ? `Answered “${short(m.body)}”: ${ANSWER_WORDS[answer]}` : `Read “${short(m.body)}”`;
    logForClient(req.user.id, 'client', `${verb}${reply ? ` — “${short(reply, 300)}”` : ''}`)
      .catch(e => console.error('Message timeline error:', e.message));
  } catch (err) {
    console.error('Respond to message error:', err);
    res.status(500).json({ error: 'Could not send your answer.' });
  }
});

module.exports = router;
