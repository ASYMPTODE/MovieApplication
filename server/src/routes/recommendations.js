import express from 'express';
import { authRequired } from '../middleware/auth.js';
import Movie from '../models/Movie.js';
import Rating from '../models/Rating.js';

const router = express.Router();

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const va = a[k] || 0; const vb = b[k] || 0;
    dot += va * vb; na += va * va; nb += vb * vb;
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

router.get('/content', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const ratings = await Rating.find({ user: userId }).populate('movie');
    const ratedMovieIds = new Set(ratings.map(r => r.movie._id.toString()));
    const genreSet = new Set();
    ratings.forEach(r => (r.movie.genres || []).forEach(g => genreSet.add(g)));
    const allGenres = Array.from(genreSet);

    function vecFromGenres(genres) {
      const v = {};
      (genres || []).forEach(g => { v[g] = 1; });
      return v;
    }

    const userVec = {};
    ratings.forEach(r => {
      (r.movie.genres || []).forEach(g => {
        userVec[g] = (userVec[g] || 0) + r.value;
      });
    });

    const candidates = await Movie.find({ _id: { $nin: Array.from(ratedMovieIds) } }).limit(500);
    const scored = candidates.map(m => ({
      movie: m,
      score: cosine(userVec, vecFromGenres(m.genres))
    }));
    scored.sort((a, b) => b.score - a.score);
    res.json({ items: scored.slice(0, 20).map(s => ({ ...s.movie.toObject(), _score: s.score })) });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

router.get('/cf', authRequired, async (req, res) => {
  try {
    const userId = req.user.id;
    const allRatings = await Rating.find({}).lean();
    const byUser = new Map();
    const byMovie = new Map();
    for (const r of allRatings) {
      if (!byUser.has(r.user.toString())) byUser.set(r.user.toString(), new Map());
      byUser.get(r.user.toString()).set(r.movie.toString(), r.value);
      if (!byMovie.has(r.movie.toString())) byMovie.set(r.movie.toString(), new Map());
      byMovie.get(r.movie.toString()).set(r.user.toString(), r.value);
    }
    const me = byUser.get(userId) || new Map();
    const rated = new Set([...me.keys()]);

    // compute similarity to other users (cosine), no KNN restriction yet
    const sims = [];
    for (const [uid, ratings] of byUser.entries()) {
      if (uid === userId) continue;
      const a = {}; const b = {};
      for (const [mid, val] of me.entries()) a[mid] = val;
      for (const [mid, val] of ratings.entries()) b[mid] = val;
      const s = cosine(a, b);
      if (s > 0) sims.push({ uid, s });
    }

    // predict score for unseen movies using weighted sum
    const scores = new Map();
    const weights = new Map();
    for (const { uid, s } of sims) {
      const ur = byUser.get(uid);
      for (const [mid, val] of ur.entries()) {
        if (rated.has(mid)) continue;
        scores.set(mid, (scores.get(mid) || 0) + s * val);
        weights.set(mid, (weights.get(mid) || 0) + Math.abs(s));
      }
    }

    const preds = [];
    for (const [mid, num] of scores.entries()) {
      const den = weights.get(mid) || 1e-9;
      preds.push({ mid, score: num / den });
    }
    preds.sort((a, b) => b.score - a.score);
    const ids = preds.slice(0, 20).map(p => p.mid);
    const movies = await Movie.find({ _id: { $in: ids } });
    const map = new Map(movies.map(m => [m._id.toString(), m]));
    const items = ids.map(id => ({ ...map.get(id)?.toObject(), _score: preds.find(p => p.mid === id)?.score || 0 })).filter(Boolean);
    res.json({ items });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

export default router;
