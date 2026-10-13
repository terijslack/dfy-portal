'use strict';

// GoHighLevel: the contact is created or updated, then tagged "new-client".

const mockPost = jest.fn();
jest.mock('axios', () => ({ post: (...a) => mockPost(...a), get: jest.fn(), put: jest.fn() }));

process.env.GHL_API_KEY = 'key';
process.env.GHL_LOCATION_ID = 'loc_1';

const { upsertGHLContact, planTag } = require('../services/ghl');

beforeEach(() => {
  mockPost.mockReset();
  mockPost.mockImplementation(url =>
    Promise.resolve({ data: url.endsWith('/contacts/upsert') ? { contact: { id: 'c_1' } } : {} }));
});

const urls = () => mockPost.mock.calls.map(c => c[0]);

test('upserts the contact (so contacts already in GHL do not error), then adds tags', async () => {
  await upsertGHLContact({ name: 'Dana Whitaker', email: 'dana@x.com', planName: 'Growth Engine' });
  expect(urls()).toEqual([
    'https://services.leadconnectorhq.com/contacts/upsert',
    'https://services.leadconnectorhq.com/contacts/c_1/tags',
  ]);
  expect(mockPost.mock.calls[0][1]).toMatchObject({ locationId: 'loc_1', email: 'dana@x.com', firstName: 'Dana', lastName: 'Whitaker' });
  expect(mockPost.mock.calls[1][1]).toEqual({ tags: ['new-client', 'Growth Engine'] });
});

test('the upsert does not send tags, so a lead\'s existing tags are never wiped', async () => {
  await upsertGHLContact({ name: 'Dana', email: 'd@x.com', planName: 'Growth Engine' });
  expect(mockPost.mock.calls[0][1]).not.toHaveProperty('tags');
});

test('custom plans are tagged "Custom Plan", not one tag per client', async () => {
  await upsertGHLContact({ name: 'Lu Ro', email: 'l@r.com', planName: "Lu'Ro Jewelers - Monthly Marketing Package" });
  expect(mockPost.mock.calls[1][1].tags).toEqual(['new-client', 'Custom Plan']);
  expect(planTag('Starter Presence')).toBe('Starter Presence');
});

test('add-ons are attached as a note', async () => {
  await upsertGHLContact({ name: 'Dana', email: 'd@x.com', planName: 'Growth Engine', addons: 'Extra posts' });
  expect(urls()[2]).toBe('https://services.leadconnectorhq.com/contacts/c_1/notes');
});

test('throws (so Stripe retries) if GHL does not return a contact id', async () => {
  mockPost.mockResolvedValue({ data: {} });
  await expect(upsertGHLContact({ name: 'Dana', email: 'd@x.com', planName: 'Growth Engine' })).rejects.toThrow(/contact id/);
});

test('throws if GHL rejects the request', async () => {
  mockPost.mockRejectedValue(new Error('401'));
  await expect(upsertGHLContact({ name: 'Dana', email: 'd@x.com', planName: 'Growth Engine' })).rejects.toThrow('401');
});
