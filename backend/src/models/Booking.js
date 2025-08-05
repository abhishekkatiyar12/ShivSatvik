const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  flat: { type: mongoose.Schema.Types.ObjectId, ref: 'Flat', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  discount:{type:Number},
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  cancellationReason: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
