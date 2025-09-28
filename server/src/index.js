import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const MONGO_URI = process.env.MONGO_URI ;
const PORT = process.env.PORT || 4000;

import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';
import ratingRoutes from './routes/ratings.js';
import recRoutes from './routes/recommendations.js';
import metricsRoutes from './routes/metrics.js';

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/recommendations', recRoutes);
app.use('/api/metrics', metricsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('connected to mongo');
    app.listen(PORT, () => {
      console.log('server running on http://localhost:' + PORT);
    });
  } catch (err) {
    console.error('failed to start', err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export default app;
