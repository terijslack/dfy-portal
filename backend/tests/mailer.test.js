'use strict';

// Gmail sender: signs in to Google as the service account (acting as MAIL_FROM)
// and sends a proper MIME message. No real network calls.

const crypto = require('crypto');

describe('mailer (Gmail API)', () => {
  let mockAxios, mailer, publicKey;

  beforeAll(() => {
    jest.resetModules();
    const keys = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    publicKey = keys.publicKey;
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({
      client_email: 'portal-mailer@dfy.iam.gserviceaccount.com',
      // as pasted into Railway: newlines escaped
      private_key: keys.privateKey.export({ type: 'pkcs8', format: 'pem' }).replace(/\n/g, '\\n'),
    });
    process.env.MAIL_FROM = 'frankie@dfymarketinggroup.com';
    mockAxios = { post: jest.fn() };
    jest.doMock('axios', () => mockAxios);
    mailer = require('../services/mailer');
  });

  afterAll(() => {
    delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    delete process.env.MAIL_FROM;
  });

  test('is configured when the key is present', () => {
    expect(mailer.isConfigured()).toBe(true);
  });

  test('signs in as the service account acting as Frankie, then sends', async () => {
    mockAxios.post.mockImplementation(url => (/oauth2/.test(url)
      ? Promise.resolve({ data: { access_token: 'tok123', expires_in: 3600 } })
      : Promise.resolve({ data: { id: 'msg1' } })));

    const out = await mailer.sendMail({
      to: 'hello@dfymarketinggroup.com', subject: 'Changes requested: Lu’Ro — post',
      html: '<p>Hi <b>there</b></p>', replyTo: 'client@example.com', important: true,
    });
    expect(out).toEqual({ id: 'msg1' });

    // 1. Token request: a valid RS256 JWT for gmail.send, impersonating MAIL_FROM
    const [tokenUrl, tokenBody] = mockAxios.post.mock.calls[0];
    expect(tokenUrl).toBe('https://oauth2.googleapis.com/token');
    const assertion = new URLSearchParams(tokenBody).get('assertion');
    const [h, c, sig] = assertion.split('.');
    const fromB64url = s => Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    const claims = JSON.parse(fromB64url(c));
    expect(claims).toMatchObject({
      iss: 'portal-mailer@dfy.iam.gserviceaccount.com',
      sub: 'frankie@dfymarketinggroup.com',
      scope: 'https://www.googleapis.com/auth/gmail.send',
    });
    expect(crypto.createVerify('RSA-SHA256').update(`${h}.${c}`).verify(publicKey, fromB64url(sig))).toBe(true);

    // 2. Send request: bearer token + MIME message
    const [sendUrl, sendBody, sendOpts] = mockAxios.post.mock.calls[1];
    expect(sendUrl).toBe('https://gmail.googleapis.com/gmail/v1/users/me/messages/send');
    expect(sendOpts.headers.Authorization).toBe('Bearer tok123');
    const mime = fromB64url(sendBody.raw).toString();
    expect(mime).toMatch(/^From: Frankie at Done For You Marketing <frankie@dfymarketinggroup\.com>/);
    expect(mime).toMatch(/\r\nTo: hello@dfymarketinggroup\.com\r\n/);
    expect(mime).toMatch(/\r\nSubject: =\?UTF-8\?B\?/); // curly apostrophe → encoded
    expect(mime).toMatch(/\r\nReply-To: client@example\.com\r\n/);
    expect(mime).toMatch(/\r\nImportance: High\r\n/);
    expect(mime).toContain(Buffer.from('<p>Hi <b>there</b></p>').toString('base64'));
  });

  test('reuses the Google sign-in for the next email', async () => {
    mockAxios.post.mockClear();
    mockAxios.post.mockResolvedValue({ data: { id: 'msg2' } });
    await mailer.sendMail({ to: 'a@b.com', subject: 'Hi', html: '<p>x</p>' });
    expect(mockAxios.post).toHaveBeenCalledTimes(1);
  });

  test('strips line breaks from headers (no header injection)', () => {
    const mime = mailer.buildMessage({ to: 'a@b.com\r\nBcc: evil@x.com', subject: 'Hi\r\nBcc: evil@x.com', html: '<p>x</p>' });
    expect(mime).not.toMatch(/\r\nBcc:/);
  });
});
