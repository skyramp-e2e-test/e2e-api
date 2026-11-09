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

  it('returns only the status and uptime fields', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptime).toBe('number');
    expect(Object.keys(res.body).sort()).toEqual(['status', 'uptime']);
  });

  it('rounds uptime to 2 decimal places', async () => {
    const spy = jest.spyOn(process, 'uptime').mockReturnValue(12.34567);
    let res;
    try {
      res = await request(createApp()).get('/health');
    } finally {
      spy.mockRestore();
    }
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', uptime: 12.35 });
  });

  it('returns the real uptime with at most 2 decimal places', async () => {
    const res = await request(createApp()).get('/health');
    expect(res.status).toBe(200);
    const { uptime } = res.body;
    expect(Number.isFinite(uptime)).toBe(true);
    expect(uptime).toBeGreaterThanOrEqual(0);
    expect(Math.round(uptime * 100) / 100).toBe(uptime);
  });

  it('returns 404 JSON for unknown routes', async () => {
    const res = await request(createApp()).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});
