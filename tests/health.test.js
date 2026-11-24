'use strict';

const request = require('supertest');
const { createApp } = require('../src/app');

describe('GET /health', () => {
  it('returns status ok', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
  });

  it('rounds uptime to 2 decimal places', async () => {
    const spy = jest.spyOn(process, 'uptime').mockReturnValue(12.34567);
    try {
      const res = await request(createApp()).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.uptime).toBe(12.35);
    } finally {
      spy.mockRestore();
    }
  });

  it('reports real uptime with at most 2 decimals', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
    expect(Math.round(res.body.uptime * 100) / 100).toBe(res.body.uptime);
  });

  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(createApp()).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});
