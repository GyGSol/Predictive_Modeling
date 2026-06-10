/**
 * PRODE-12: Tests TDD — health endpoint
 * T-Shirt: S
 */
import request from 'supertest';
import { createApp } from '../src/app.js';

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const app = createApp();
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('predictive-modeling-api');
  });

  it('does not expose x-powered-by header', async () => {
    const app = createApp();
    const response = await request(app).get('/api/health');

    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
