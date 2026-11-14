'use strict';
// One-off client emails from the admin (services/clientEmail.js)

jest.mock('../services/mailer', () => ({ isConfigured: () => true, sendMail: jest.fn().mockResolvedValue({ id: 'x' }) }));
const mailer = require('../services/mailer');
const { renderClientEmail, plainText, sendClientEmail } = require('../services/clientEmail');

test('paragraphs, line breaks, links and a button', () => {
  const html = renderClientEmail('Hi there,\n\nSee https://example.com/a.\nLine two\n\n[Open the steps](https://dfymarketinggroup.com/login?next=/profile)');
  expect(html).toContain('<p style="font-size:15px;line-height:1.6;margin:0 0 16px;color:#444;">Hi there,</p>');
  expect(html).toContain('<a href="https://example.com/a" style="color:#2D6B4F;">https://example.com/a</a>.<br>Line two');
  expect(html).toContain('href="https://dfymarketinggroup.com/login?next=/profile"');
  expect(html).toContain('>Open the steps</a>');
});

test('escapes HTML and refuses non-http buttons', () => {
  const html = renderClientEmail('<b>hi</b>\n\n[Click](javascript:alert(1))');
  expect(html).toContain('&lt;b&gt;hi&lt;/b&gt;');
  expect(html).not.toContain('href="javascript');
});

test('plain-text version turns buttons into "label: link"', () => {
  expect(plainText('Hi\n\n[Open the steps](https://x.com/y)')).toBe('Hi\n\nOpen the steps: https://x.com/y');
});

test('sends through the mailer', async () => {
  await sendClientEmail({ to: 'a@b.com', subject: 'S', body: 'Hello' });
  expect(mailer.sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: 'a@b.com', subject: 'S', text: 'Hello' }));
});
