/**
 * PRODE-8: Tests de validación en consulta de partidos
 * T-Shirt: S
 */
import request from 'supertest';
import { createApp } from '../src/app.js';
import { matchesQuerySchema, syncBodySchema } from '../src/schemas/api.schema.js';

describe('GET /api/matches', () => {
  it('rejects invalid date format', async () => {
    const app = createApp();
    const response = await request(app).get('/api/matches?date=10-03-2024');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation failed');
  });
});

describe('POST /api/sync', () => {
  it('rejects invalid season', async () => {
    const app = createApp();
    const response = await request(app).post('/api/sync').send({ season: 1999 });

    expect(response.status).toBe(400);
  });
});

describe('api schemas', () => {
  it('parses valid match query params', () => {
    const parsed = matchesQuerySchema.parse({ date: '2024-03-10', limit: '10' });
    expect(parsed.date).toBe('2024-03-10');
    expect(parsed.limit).toBe(10);
  });

  it('accepts optional sync body', () => {
    const parsed = syncBodySchema.parse({});
    expect(parsed).toEqual({});
  });
});
