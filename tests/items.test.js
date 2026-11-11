'use strict';

const request = require('supertest');
const { createApp } = require('../src/app');

describe('/api/items', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  const createItem = (body = { name: 'Widget', description: 'A widget' }) =>
    request(app).post('/api/items').send(body);

  describe('GET /api/items', () => {
    it('returns an empty list initially', async () => {
      const res = await request(app).get('/api/items');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('lists created items', async () => {
      await createItem({ name: 'A' });
      await createItem({ name: 'B' });
      const res = await request(app).get('/api/items');
      expect(res.status).toBe(200);
      expect(res.body.map((i) => i.name)).toEqual(['A', 'B']);
    });

    it('returns at most N items when ?limit=N', async () => {
      await createItem({ name: 'A' });
      await createItem({ name: 'B' });
      await createItem({ name: 'C' });
      const res = await request(app).get('/api/items?limit=2');
      expect(res.status).toBe(200);
      expect(res.body.map((i) => i.name)).toEqual(['A', 'B']);
    });

    it('returns all items when limit exceeds the count', async () => {
      await createItem({ name: 'A' });
      const res = await request(app).get('/api/items?limit=100');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
    });

    it('refuses a limit above 100 with 400', async () => {
      const res = await request(app).get('/api/items?limit=101');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/100/);
    });

    it('returns every item when no limit is given, even more than 100', async () => {
      for (let i = 0; i < 105; i += 1) {
        await createItem({ name: `Item ${i}` });
      }
      const res = await request(app).get('/api/items');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(105);
    });

    it('filters by name with ?q=text, case-insensitively', async () => {
      await createItem({ name: 'banana' });
      await createItem({ name: 'Apple' });
      await createItem({ name: 'MANGO' });
      const res = await request(app).get('/api/items?q=An');
      expect(res.status).toBe(200);
      expect(res.body.map((i) => i.name)).toEqual(['banana', 'MANGO']);
    });

    it('returns an empty list when nothing matches ?q', async () => {
      await createItem({ name: 'Apple' });
      const res = await request(app).get('/api/items?q=zzz');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('applies limit after the ?q filter', async () => {
      await createItem({ name: 'Apple' });
      await createItem({ name: 'banana' });
      await createItem({ name: 'mango' });
      await createItem({ name: 'cherry' });
      const res = await request(app).get('/api/items?q=an&limit=1');
      expect(res.status).toBe(200);
      expect(res.body.map((i) => i.name)).toEqual(['banana']);
    });

    it('refuses a repeated q parameter with 400', async () => {
      const res = await request(app).get('/api/items?q=a&q=b');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'q must be a single string' });
    });

    it('sorts by name A→Z, ignoring case, with ?sort=name', async () => {
      await createItem({ name: 'cherry' });
      await createItem({ name: 'Apple' });
      await createItem({ name: 'banana' });
      const res = await request(app).get('/api/items?sort=name');
      expect(res.status).toBe(200);
      expect(res.body.map((i) => i.name)).toEqual(['Apple', 'banana', 'cherry']);
    });

    it('keeps insertion order without ?sort', async () => {
      await createItem({ name: 'cherry' });
      await createItem({ name: 'Apple' });
      const res = await request(app).get('/api/items');
      expect(res.body.map((i) => i.name)).toEqual(['cherry', 'Apple']);
    });

    it('sorts before applying limit', async () => {
      await createItem({ name: 'cherry' });
      await createItem({ name: 'banana' });
      await createItem({ name: 'apple' });
      const res = await request(app).get('/api/items?sort=name&limit=2');
      expect(res.status).toBe(200);
      expect(res.body.map((i) => i.name)).toEqual(['apple', 'banana']);
    });

    it('refuses an unknown sort value with 400', async () => {
      const res = await request(app).get('/api/items?sort=createdAt');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "sort must be 'name'" });
    });

    it('refuses a non-numeric or zero limit with 400', async () => {
      expect((await request(app).get('/api/items?limit=abc')).status).toBe(400);
      expect((await request(app).get('/api/items?limit=0')).status).toBe(400);
    });
  });

  describe('POST /api/items', () => {
    it('creates an item', async () => {
      const res = await createItem();
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: 'Widget', description: 'A widget' });
      expect(res.body.id).toEqual(expect.any(String));
      expect(res.body.createdAt).toEqual(expect.any(String));
      expect(res.body.updatedAt).toEqual(res.body.createdAt);
    });

    it('defaults description to empty string and trims name', async () => {
      const res = await createItem({ name: '  Gadget  ' });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ name: 'Gadget', description: '' });
    });

    it('ignores unknown fields', async () => {
      const res = await createItem({ name: 'X', id: 'hijack', extra: true });
      expect(res.status).toBe(201);
      expect(res.body.id).not.toBe('hijack');
      expect(res.body.extra).toBeUndefined();
    });

    it.each([
      [{}, 'name is required and must be a non-empty string'],
      [{ name: '' }, 'name is required and must be a non-empty string'],
      [{ name: '   ' }, 'name is required and must be a non-empty string'],
      [{ name: 42 }, 'name is required and must be a non-empty string'],
      [{ name: 'ok', description: 5 }, 'description must be a string'],
      [[], 'Request body must be a JSON object'],
    ])('rejects invalid body %j', async (body, error) => {
      const res = await createItem(body);
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error });
    });

    it('rejects malformed JSON', async () => {
      const res = await request(app)
        .post('/api/items')
        .set('Content-Type', 'application/json')
        .send('{"name":');
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Malformed JSON' });
    });
  });

  describe('GET /api/items/:id', () => {
    it('returns an item by id', async () => {
      const created = await createItem();
      const res = await request(app).get(`/api/items/${created.body.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(created.body);
    });

    it('returns 404 for a missing item', async () => {
      const res = await request(app).get('/api/items/missing');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Item not found' });
    });
  });

  describe('PUT /api/items/:id', () => {
    it('replaces an item', async () => {
      const created = await createItem();
      const res = await request(app)
        .put(`/api/items/${created.body.id}`)
        .send({ name: 'Renamed' });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        id: created.body.id,
        name: 'Renamed',
        description: '',
        createdAt: created.body.createdAt,
      });
    });

    it('validates the body', async () => {
      const created = await createItem();
      const res = await request(app).put(`/api/items/${created.body.id}`).send({});
      expect(res.status).toBe(400);
    });

    it('returns 404 for a missing item', async () => {
      const res = await request(app).put('/api/items/missing').send({ name: 'X' });
      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/items/:id', () => {
    it('partially updates an item', async () => {
      const created = await createItem();
      const res = await request(app)
        .patch(`/api/items/${created.body.id}`)
        .send({ description: 'Updated' });
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: 'Widget', description: 'Updated' });
    });

    it('rejects an empty patch', async () => {
      const created = await createItem();
      const res = await request(app).patch(`/api/items/${created.body.id}`).send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'At least one of name or description must be provided' });
    });

    it('rejects an invalid name', async () => {
      const created = await createItem();
      const res = await request(app).patch(`/api/items/${created.body.id}`).send({ name: '' });
      expect(res.status).toBe(400);
    });

    it('returns 404 for a missing item', async () => {
      const res = await request(app).patch('/api/items/missing').send({ name: 'X' });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('deletes an item', async () => {
      const created = await createItem();
      const del = await request(app).delete(`/api/items/${created.body.id}`);
      expect(del.status).toBe(204);
      const get = await request(app).get(`/api/items/${created.body.id}`);
      expect(get.status).toBe(404);
    });

    it('returns 404 for a missing item', async () => {
      const res = await request(app).delete('/api/items/missing');
      expect(res.status).toBe(404);
    });
  });
});
