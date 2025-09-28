import express from 'express';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Rating from '../models/Rating.js';
import { authRequired } from '../middleware/auth.js';
import { adminRequired } from '../middleware/auth.js';

const router = express.Router();

router.get('/overview', authRequired, adminRequired, async (req, res) => {
  try {
    const [users, movies, ratings] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Rating.countDocuments()
    ]);
    let avgRatingsPerUser = 0;
    if (users > 0) avgRatingsPerUser = ratings / users;
    // coverage: fraction of (movies that have at least one rating) over total movies
    const ratedMovieIds = await Rating.distinct('movie');
    const coverage = movies > 0 ? ratedMovieIds.length / movies : 0;

    // simple chart: top genres by count
    const genreCounts = await Movie.aggregate([
      { $unwind: { path: '$genres', preserveNullAndEmptyArrays: false } },
      { $group: { _id: '$genres', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json({ tiles: { users, movies, ratings, avgRatingsPerUser, coverage }, chart: { topGenres: genreCounts } });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

export default router;
