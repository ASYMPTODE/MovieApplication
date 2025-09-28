import request from 'supertest';
import app from './index.js';

describe('auth', () => {
  it('health works', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
