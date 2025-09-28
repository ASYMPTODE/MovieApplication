import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, index: 'text' },
  year: { type: Number },
  genres: [{ type: String, index: true }],
  overview: { type: String },
  avgRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
});

movieSchema.index({ title: 'text', overview: 'text' });

export default mongoose.model('Movie', movieSchema);
