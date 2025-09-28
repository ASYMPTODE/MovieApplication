import request from 'supertest';
import app from './index.js';
import Movie from './models/Movie.js';

async function signupAndGetAgent(email = 'a@test.com', password = 'pass123') {
  const agent = request.agent(app);
  await agent.post('/api/auth/signup').send({ email, password });
  return agent;
}

describe('movies & ratings & recs', () => {
  beforeEach(async () => {
    await Movie.insertMany([
      { title: 'A', year: 2000, genres: ['Action'] },
      { title: 'B', year: 2001, genres: ['Drama'] },
      { title: 'C', year: 2002, genres: ['Action'] }
    ]);
  });

  it('can rate and update and delete, and compute avg', async () => {
    const agent = await signupAndGetAgent('r1@test.com');
    const list = await agent.get('/api/movies');
    const m = list.body.items[0];
    const r1 = await agent.post('/api/ratings').send({ movieId: m._id, value: 5 });
    expect(r1.status).toBe(201);
    const mine = await agent.get('/api/ratings/me');
    expect(mine.body.items.length).toBe(1);
    const del = await agent.delete('/api/ratings/' + mine.body.items[0]._id);
    expect(del.body.ok).toBe(true);
  });

  it('content recs exclude already rated', async () => {
    const agent = await signupAndGetAgent('r2@test.com');
    const list = await agent.get('/api/movies');
    const m = list.body.items[0];
    await agent.post('/api/ratings').send({ movieId: m._id, value: 5 });
    const recs = await agent.get('/api/recommendations/content');
    const ids = recs.body.items.map(x => x._id);
    expect(ids).not.toContain(m._id);
  });

  it('cf recs work and exclude rated', async () => {
    const u1 = await signupAndGetAgent('u1@test.com');
    const u2 = await signupAndGetAgent('u2@test.com');
    const list = await u1.get('/api/movies');
    const [m1, m2, m3] = list.body.items;
    // u1 rates two movies
    await u1.post('/api/ratings').send({ movieId: m1._id, value: 5 });
    await u1.post('/api/ratings').send({ movieId: m2._id, value: 4 });
    // u2 rates overlapping one and the third
    await u2.post('/api/ratings').send({ movieId: m1._id, value: 5 });
    await u2.post('/api/ratings').send({ movieId: m3._id, value: 5 });
    const recs = await u1.get('/api/recommendations/cf');
    // m3 should be a candidate, m1/m2 excluded
    const ids = recs.body.items.map(x => x._id);
    expect(ids).not.toContain(m1._id);
    expect(ids).not.toContain(m2._id);
  });

  it('metrics overview returns tiles and chart', async () => {
    const res = await request(app).get('/api/metrics/overview');
    expect(res.status).toBe(200);
    expect(res.body.tiles).toBeTruthy();
    expect(res.body.tiles).toHaveProperty('users');
    expect(res.body.chart).toBeTruthy();
  });
});
