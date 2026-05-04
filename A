// addClient.js — Use this to add a new real client
// Run in Railway → your web service → Shell tab:
// node database/addClient.js "Client Name" "email@client.com" "temporaryPassword"

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addClient() {
  // Read the arguments you typed in the command
  const [,, name, email, password] = process.argv;

  // Make sure all three arguments were provided
  if (!name || !email || !password) {
    console.error('Usage: node database/addClient.js "Client Name" "email@example.com" "password"');
    process.exit(1);
  }

  try {
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(`
      INSERT INTO clients (name, email, password, is_admin)
      VALUES ($1, $2, $3, false)
      RETURNING id, name, email
    `, [name, email, hashedPassword]);

    const client = result.rows[0];
    console.log(`✅ Client created!`);
    console.log(`   Name:  ${client.name}`);
    console.log(`   Email: ${client.email}`);
    console.log(`   ID:    ${client.id}`);
    console.log('');
    console.log('Send them their login URL and this temporary password:');
    console.log(`   Password: ${password}`);

  } catch (err) {
    if (err.code === '23505') { // unique violation = email already exists
      console.error(`❌ A client with email "${email}" already exists.`);
    } else {
      console.error('❌ Error:', err.message);
    }
  } finally {
    await pool.end();
  }
}

addClient();
