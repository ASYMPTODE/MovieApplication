import express from 'express';
import Movie from '../models/Movie.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q, year, genre, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ title: rx }, { overview: rx }];
    }
    if (year) filter.year = Number(year);
    if (genre) filter.genres = genre;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Movie.find(filter).sort({ title: 1 }).skip(skip).limit(Number(limit)),
      Movie.countDocuments(filter)
    ]);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

export default router;

// admin create
router.post('/', authRequired, adminRequired, async (req, res) => {
  try {
    const { title, year, genres, overview } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });
    const doc = await Movie.create({ title, year, genres, overview });
    res.status(201).json(doc);
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

// admin update
router.put('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const { title, year, genres, overview } = req.body;
    const doc = await Movie.findByIdAndUpdate(req.params.id, { title, year, genres, overview }, { new: true });
    if (!doc) return res.status(404).json({ error: 'not found' });
    res.json(doc);
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

// admin delete
router.delete('/:id', authRequired, adminRequired, async (req, res) => {
  try {
    const doc = await Movie.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ error: 'not found' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});
