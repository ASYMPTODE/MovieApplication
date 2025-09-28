import express from 'express';
import Rating from '../models/Rating.js';
import Movie from '../models/Movie.js';
import { authRequired } from '../middleware/auth.js';

const router = express.Router();

async function recomputeMovieStats(movieId) {
  const stats = await Rating.aggregate([
    { $match: { movie: movieId } },
    { $group: { _id: '$movie', avg: { $avg: '$value' }, count: { $sum: 1 } } }
  ]);
  const { avg = 0, count = 0 } = stats[0] || {};
  await Movie.findByIdAndUpdate(movieId, { avgRating: avg, ratingCount: count });
}

router.post('/', authRequired, async (req, res) => {
  try {
    const { movieId, value } = req.body;
    if (!movieId || !value) return res.status(400).json({ error: 'movieId and value required' });
    const doc = await Rating.findOneAndUpdate(
      { user: req.user.id, movie: movieId },
      { value },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await recomputeMovieStats(doc.movie);
    res.status(201).json(doc);
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

router.get('/me', authRequired, async (req, res) => {
  try {
    const items = await Rating.find({ user: req.user.id }).populate('movie');
    res.json({ items });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

router.delete('/:id', authRequired, async (req, res) => {
  try {
    const rating = await Rating.findOne({ _id: req.params.id, user: req.user.id });
    if (!rating) return res.status(404).json({ error: 'not found' });
    await Rating.deleteOne({ _id: rating._id });
    await recomputeMovieStats(rating.movie);
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

export default router;
