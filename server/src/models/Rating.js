import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  value: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

ratingSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.model('Rating', ratingSchema);
