'use strict';

// The welcome email that replaced the GoHighLevel "New Client Welcome" workflow:
//  - custom plans / brand-new accounts get a working "Set your password" button
//  - standard-plan signups just get "Log into your portal"
//  - sent only once per client; a failed send is un-marked so Stripe's retry sends it
//  - nothing is sent if Google Workspace email isn't set up

const mockDbQuery = jest.fn();
const mockSend = jest.fn();
const mockConfigured = jest.fn();
const mockLog = jest.fn();

jest.mock('pg', () => ({ Pool: jest.fn(() => ({ query: mockDbQuery })) }));
jest.mock('../services/mailer', () => ({
  isConfigured: () => mockConfigured(),
  sendMail: (...a) => mockSend(...a),
}));
jest.mock('../services/activity', () => ({ logForClient: (...a) => mockLog(...a) }));

const { sendWelcomeEmail, welcomeHtml, isCustomPlan } = require('../services/welcomeEmail');

const CLIENT = { id: 12, name: 'Jose Lopez', email: 'jose@luro.com', plan: "Lu'Ro Monthly Package" };
const calls = re => mockDbQuery.mock.calls.filter(c => re.test(c[0]));

function setDb({ claimed = CLIENT } = {}) {
  mockDbQuery.mockImplementation(sql => {
    if (/SET welcome_email_sent_at = NOW\(\)/.test(sql)) return Promise.resolve({ rows: claimed ? [claimed] : [] });
    return Promise.resolve({ rows: [] });
  });
}

beforeEach(() => {
  mockDbQuery.mockReset(); mockSend.mockReset(); mockLog.mockReset();
  mockConfigured.mockReturnValue(true);
  mockSend.mockResolvedValue({ id: 'm1' });
  mockLog.mockResolvedValue();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test('standard plans are not custom; anything else is', () => {
  expect(isCustomPlan('Growth Engine')).toBe(false);
  expect(isCustomPlan('Starter Presence')).toBe(false);
  expect(isCustomPlan("Lu'Ro Monthly Package")).toBe(true);
  expect(isCustomPlan('Custom Plan')).toBe(true);
});

test('custom plan: saves a 7-day set-password token and emails a button to it', async () => {
  setDb();
  const r = await sendWelcomeEmail({ clientId: 12, planName: "Lu'Ro Monthly Package" });
  expect(r).toEqual({ sent: true, withPassword: true });

  const tokenSave = calls(/password_reset_token = \$1/)[0];
  const [token, expires, id] = tokenSave[1];
  expect(id).toBe(12);
  expect(token).toMatch(/^[0-9a-f]{64}$/);
  const days = (expires - Date.now()) / 86400000;
  expect(days).toBeGreaterThan(6.9); expect(days).toBeLessThan(7.1);

  const mail = mockSend.mock.calls[0][0];
  expect(mail.to).toBe('jose@luro.com');
  expect(mail.subject).toBe("Welcome to DFY Marketing — let's get started!");
  expect(mail.html).toContain(`/reset-password.html?token=${token}&amp;welcome=1`);
  expect(mail.html).toContain('Set your password');
  expect(mail.html).toContain('Hi Jose,');
  expect(mockLog).toHaveBeenCalledWith(12, 'dfy', expect.stringContaining('Welcome email sent'), 'welcome:client:12');
});

test('standard plan signup: no token, just the log-in button', async () => {
  setDb({ claimed: { ...CLIENT, plan: 'Growth Engine' } });
  const r = await sendWelcomeEmail({ clientId: 12, planName: 'Growth Engine' });
  expect(r).toEqual({ sent: true, withPassword: false });
  expect(calls(/password_reset_token/)).toHaveLength(0);
  const html = mockSend.mock.calls[0][0].html;
  expect(html).toContain('Log into your portal');
  expect(html).not.toContain('Set your password');
});

test('a brand-new account on a standard plan still gets the set-password version', async () => {
  setDb({ claimed: { ...CLIENT, plan: 'Growth Engine' } });
  const r = await sendWelcomeEmail({ clientId: 12, planName: 'Growth Engine', needsPassword: true });
  expect(r.withPassword).toBe(true);
});

test('already sent (repeat Stripe delivery): sends nothing', async () => {
  setDb({ claimed: null });
  const r = await sendWelcomeEmail({ clientId: 12, planName: 'Growth Engine' });
  expect(r).toEqual({ skipped: 'already-sent' });
  expect(mockSend).not.toHaveBeenCalled();
});

test('send fails: un-marks the client and throws so Stripe retries', async () => {
  setDb();
  mockSend.mockRejectedValue(new Error('Gmail down'));
  await expect(sendWelcomeEmail({ clientId: 12, planName: 'Custom Plan' })).rejects.toThrow('Gmail down');
  expect(calls(/SET welcome_email_sent_at = NULL/)[0][1]).toEqual([12]);
  expect(mockLog).not.toHaveBeenCalled();
});

test('email not set up: sends nothing and does not mark the client', async () => {
  mockConfigured.mockReturnValue(false);
  const r = await sendWelcomeEmail({ clientId: 12, planName: 'Custom Plan' });
  expect(r).toEqual({ skipped: 'not-configured' });
  expect(mockDbQuery).not.toHaveBeenCalled();
  expect(mockSend).not.toHaveBeenCalled();
});

test('names are escaped and a blank name reads "Hi there,"', () => {
  expect(welcomeHtml({ name: '<b>Al</b> Smith' })).toContain('Hi &lt;b&gt;Al&lt;/b&gt;,');
  expect(welcomeHtml({ name: '' })).toContain('Hi there,');
});
