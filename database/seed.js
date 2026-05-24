// seed.js — Run this ONCE after setting up your database
// It creates a test client and some sample posts so you can see everything working
// Run it in Railway → your web service → Shell tab: node database/seed.js

require('dotenv').config(); // loads your .env file
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// connects to your database using the DATABASE_URL from .env
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  console.log('🌱 Starting seed...');

  try {
    // First run the schema to make sure tables exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        business_name VARCHAR(255),
        is_admin BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'active',
        stripe_price_id VARCHAR(255),
        stripe_customer_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        caption TEXT NOT NULL,
        platform VARCHAR(50) NOT NULL,
        scheduled_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        change_notes TEXT,
        buffer_post_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_posts_client_id ON posts(client_id);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
    `);

    // Hash the passwords before storing them (NEVER store plain text passwords)
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clientPassword = await bcrypt.hash('password123', 10);

    // Create admin account (that's you)
    await pool.query(`
      INSERT INTO clients (name, email, password, is_admin, status)
      VALUES ('Admin', 'admin@dfymarketing.com', $1, true, 'active')
      ON CONFLICT (email) DO NOTHING
    `, [adminPassword]);

    // Create a test client
    const clientResult = await pool.query(`
      INSERT INTO clients (name, email, password, business_name, is_admin, status)
      VALUES ('Bloom Wellness', 'test@example.com', $1, 'Bloom Wellness', false, 'active')
      ON CONFLICT (email) DO UPDATE SET name = 'Bloom Wellness'
      RETURNING id
    `, [clientPassword]);

    const clientId = clientResult.rows[0].id;

    // Add some sample posts for the test client
    const samplePosts = [
      {
        caption: '🌸 Spring is here and so is our new seasonal facial! Book yours this week and get 15% off. Link in bio. #BloomWellness #SpringSkincare',
        platform: 'instagram',
        scheduled_date: '2026-05-05'
      },
      {
        caption: 'Did you know hydration is the #1 thing you can do for your skin this time of year? Drop your favorite hydration tip below 👇',
        platform: 'facebook',
        scheduled_date: '2026-05-08'
      },
      {
        caption: 'New blog post: 5 ways to refresh your skincare routine for spring. Read it at the link in our bio! ✨',
        platform: 'instagram',
        scheduled_date: '2026-05-12'
      }
    ];

    for (const post of samplePosts) {
      await pool.query(`
        INSERT INTO posts (client_id, caption, platform, scheduled_date)
        VALUES ($1, $2, $3, $4)
      `, [clientId, post.caption, post.platform, post.scheduled_date]);
    }

    console.log('✅ Seed complete!');
    console.log('');
    console.log('Test client login:');
    console.log('  Email:    test@example.com');
    console.log('  Password: password123');
    console.log('');
    console.log('Admin login:');
    console.log('  Email:    admin@dfymarketing.com');
    console.log('  Password: admin123');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await pool.end(); // close the database connection
  }
}

seed();
