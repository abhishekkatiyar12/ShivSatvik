const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { timestamps: true });

const flatSchema = new mongoose.Schema({
  type: { type: String, required: true },
  description: String,
  pricePerNight: Number,
  location: String,
  images: [String],
  amenities: [String],
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  availability: [{ startDate: Date, endDate: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Flat', flatSchema);
