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

  describe('GET /api/items/count', () => {
    const getCount = () => request(app).get('/api/items/count');

    it('returns a count of 0 when there are no items', async () => {
      const res = await getCount();
      expect(res.status).toBe(200);
      expect(res.body).not.toEqual({ error: 'Item not found' });
      expect(res.body).toEqual({ count: 0 });
    });

    it('is answered by the count route with or without a trailing slash', async () => {
      const res = await request(app).get('/api/items/count/');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 0 });
    });

    it('returns the number of stored items and only the count key', async () => {
      expect((await createItem({ name: 'A' })).status).toBe(201);
      const afterOne = await getCount();
      expect(afterOne.status).toBe(200);
      expect(afterOne.body).toEqual({ count: 1 });

      expect((await createItem({ name: 'B' })).status).toBe(201);
      expect((await createItem({ name: 'C' })).status).toBe(201);
      const res = await getCount();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 3 });
      expect(typeof res.body.count).toBe('number');

      const list = await request(app).get('/api/items');
      expect(list.body).toHaveLength(res.body.count);
    });

    it('follows deletes and is unchanged by updates or rejected creates', async () => {
      const first = await createItem({ name: 'A' });
      await createItem({ name: 'B' });
      expect((await getCount()).body).toEqual({ count: 2 });

      expect((await request(app).put(`/api/items/${first.body.id}`).send({ name: 'X' })).status).toBe(
        200,
      );
      expect(
        (await request(app).patch(`/api/items/${first.body.id}`).send({ description: 'd' })).status,
      ).toBe(200);
      expect((await getCount()).body).toEqual({ count: 2 });

      expect((await createItem({ name: '' })).status).toBe(400);
      expect((await getCount()).body).toEqual({ count: 2 });

      expect((await request(app).delete(`/api/items/${first.body.id}`)).status).toBe(204);
      expect((await getCount()).body).toEqual({ count: 1 });

      expect((await request(app).delete('/api/items/missing')).status).toBe(404);
      expect((await getCount()).body).toEqual({ count: 1 });
    });

    it('returns the total count regardless of limit and offset params', async () => {
      await createItem({ name: 'A' });
      await createItem({ name: 'B' });
      await createItem({ name: 'C' });
      const res = await request(app).get('/api/items/count?limit=1&offset=2');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ count: 3 });
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
