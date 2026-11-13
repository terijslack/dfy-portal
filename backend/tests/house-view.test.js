// One login: admin switches to DFY's own client account and back.

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

let mockQueryImpl;
jest.mock('pg', () => {
  const mPool = { query: jest.fn((...args) => mockQueryImpl(...args)) };
  return { Pool: jest.fn(() => mPool) };
});
jest.mock('../services/email', () => ({ sendPasswordReset: jest.fn() }));

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/auth', require('../routes/auth'));
  return app;
}

const sign = payload => jwt.sign(payload, JWT_SECRET);
const ADMIN = { id: 1, email: 'admin@dfymarketing.com', is_admin: true };
const HOUSE = { id: 69, name: 'Teri Slack', email: 'teri@dfymarketinggroup.com', business_name: 'Done For You Marketing' };

function cookiesFrom(res) {
  const out = {};
  for (const c of res.headers['set-cookie'] || []) {
    const [pair] = c.split(';');
    const i = pair.indexOf('=');
    out[pair.slice(0, i)] = decodeURIComponent(pair.slice(i + 1));
  }
  return out;
}

describe('DFY client view (one login)', () => {
  let app;
  beforeEach(() => {
    jest.resetModules();
    mockQueryImpl = jest.fn(async (sql, params) => {
      if (/SELECT status, subscription_status/.test(sql)) return { rows: [{ status: 'active', subscription_status: 'active' }] };
      if (/is_house_account = TRUE/.test(sql)) return { rows: [HOUSE] };
      if (/SELECT is_admin FROM clients/.test(sql)) return { rows: [{ is_admin: params[0] === 1 }] };
      if (/SELECT id, name, email, is_admin, business_name/.test(sql)) {
        return { rows: [params[0] === 69 ? { ...HOUSE, is_admin: false } : { ...ADMIN, name: 'Admin', business_name: null }] };
      }
      return { rows: [] };
    });
    app = buildApp();
  });

  test('admin switches to the house account, keeping the admin session aside', async () => {
    const adminToken = sign(ADMIN);
    const res = await request(app).post('/api/auth/house-view').set('Cookie', `token=${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.redirect).toBe('/dashboard');
    const c = cookiesFrom(res);
    expect(c.admin_token).toBe(adminToken);
    const viewing = jwt.verify(c.token, JWT_SECRET);
    expect(viewing).toMatchObject({ id: 69, is_admin: false, admin_id: 1 });

    const me = await request(app).get('/api/auth/me').set('Cookie', `token=${c.token}`);
    expect(me.body.user).toMatchObject({ id: 69, viewing_as_admin: true });
  });

  test('a client cannot switch', async () => {
    const res = await request(app).post('/api/auth/house-view').set('Cookie', `token=${sign({ id: 42 })}`);
    expect(res.status).toBe(403);
  });

  test('back to admin restores the admin session', async () => {
    const adminToken = sign(ADMIN);
    const viewing = sign({ id: 69, is_admin: false, admin_id: 1 });
    const res = await request(app).post('/api/auth/back-to-admin').set('Cookie', `token=${viewing}; admin_token=${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.redirect).toBe('/admin/dashboard');
    const c = cookiesFrom(res);
    expect(c.token).toBe(adminToken);
    expect(c.admin_token).toBe('');
  });

  test('back to admin refuses without a real admin session', async () => {
    const res = await request(app).post('/api/auth/back-to-admin').set('Cookie', `admin_token=${sign({ id: 42, is_admin: false })}`);
    expect(res.status).toBe(401);
    const forged = await request(app).post('/api/auth/back-to-admin').set('Cookie', `admin_token=${jwt.sign(ADMIN, 'wrong')}`);
    expect(forged.status).toBe(401);
  });

  test('a regular client login is not marked as the admin view', async () => {
    const me = await request(app).get('/api/auth/me').set('Cookie', `token=${sign({ id: 69 })}`);
    expect(me.body.user.viewing_as_admin).toBe(false);
  });
});
