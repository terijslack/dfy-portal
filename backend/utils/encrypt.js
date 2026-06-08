// backend/utils/encrypt.js — AES-256-CBC encryption for sensitive fields at rest.
// Key is derived from JWT_SECRET via scryptSync so no extra env var is needed.
// Ciphertext format stored in DB: "<iv_hex>:<encrypted_hex>"

const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const IV_BYTES  = 16;

// Lazily derive the 32-byte key from JWT_SECRET the first time it is needed.
let _key = null;
function getKey() {
  if (_key) return _key;
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set — cannot derive encryption key');
  _key = crypto.scryptSync(secret, 'dfy-portal-social-pw-salt', 32);
  return _key;
}

// encrypt(plaintext) → "<iv_hex>:<ciphertext_hex>"  or null for falsy input
function encrypt(plaintext) {
  if (!plaintext) return null;
  const iv  = crypto.randomBytes(IV_BYTES);
  const key = getKey();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// decrypt("<iv_hex>:<ciphertext_hex>") → plaintext string, or null if input is falsy / corrupt
function decrypt(stored) {
  if (!stored) return null;
  try {
    const [ivHex, encHex] = stored.split(':');
    if (!ivHex || !encHex) return null;
    const iv         = Buffer.from(ivHex, 'hex');
    const encrypted  = Buffer.from(encHex, 'hex');
    const key        = getKey();
    const decipher   = crypto.createDecipheriv(ALGORITHM, key, iv);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  } catch {
    return null; // gracefully handle any legacy plaintext or corrupt rows
  }
}

module.exports = { encrypt, decrypt };
