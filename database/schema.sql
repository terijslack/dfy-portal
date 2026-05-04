-- Run this in Railway → your Postgres service → Query tab
-- This creates all the tables your app needs

-- CLIENTS table: stores each of your marketing clients
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,              -- auto-incrementing ID
  name VARCHAR(255) NOT NULL,         -- e.g. "Bloom Wellness"
  email VARCHAR(255) UNIQUE NOT NULL, -- their login email
  password VARCHAR(255) NOT NULL,     -- hashed password (never stored plain)
  is_admin BOOLEAN DEFAULT FALSE,     -- true = you (admin), false = client
  created_at TIMESTAMP DEFAULT NOW()
);

-- POSTS table: stores every social media post for every client
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE, -- which client owns this post
  caption TEXT NOT NULL,              -- the actual post text
  platform VARCHAR(50) NOT NULL,      -- 'instagram', 'facebook', 'twitter', etc.
  scheduled_date DATE NOT NULL,       -- when it's supposed to go out
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'changes_requested', 'queued'
  change_notes TEXT,                  -- client's notes if they request changes
  buffer_post_id VARCHAR(255),        -- Buffer's ID once the post is sent to Buffer
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- INDEX: makes looking up posts by client much faster
CREATE INDEX IF NOT EXISTS idx_posts_client_id ON posts(client_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
