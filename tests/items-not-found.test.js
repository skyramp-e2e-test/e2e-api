'use strict';

const request = require('supertest');
const { createApp } = require('../src/app');

describe('GET /api/items/:id for an unknown item', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  const createItem = (body = { name: 'Widget' }) => request(app).post('/api/items').send(body);

  it('returns 404 for a well-formed UUID no item has', async () => {
    await createItem();
    const res = await request(app).get('/api/items/00000000-0000-4000-8000-000000000000');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Item not found' });
  });

  it('returns 404 with an error body for an item that was deleted', async () => {
    const created = await createItem();
    const del = await request(app).delete(`/api/items/${created.body.id}`);
    expect(del.status).toBe(204);
    const res = await request(app).get(`/api/items/${created.body.id}`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Item not found' });
  });

  it('answers a missing item with the same 404 as PUT, PATCH and DELETE', async () => {
    const get = await request(app).get('/api/items/missing');
    const put = await request(app).put('/api/items/missing').send({ name: 'X' });
    const patch = await request(app).patch('/api/items/missing').send({ name: 'X' });
    const del = await request(app).delete('/api/items/missing');
    expect({ get: get.status, put: put.status, patch: patch.status, delete: del.status }).toEqual({
      get: 404,
      put: 404,
      patch: 404,
      delete: 404,
    });
    expect(get.body).toEqual({ error: 'Item not found' });
  });
});
