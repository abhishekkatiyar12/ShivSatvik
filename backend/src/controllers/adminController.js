const User = require('../models/User');
const Booking = require('../models/Booking');
const Flat = require('../models/Flat');
const Payment = require('../models/Payment');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, revenue: { $sum: "$amount" } } }]);

    res.json({
      totalUsers,
      totalBookings,
      totalRevenue: totalRevenue[0]?.revenue || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user flat');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.adminRefund = async (req, res) => {
  try {
    const { paymentId, refundAmount } = req.body;

    const payment = await Payment.findOne({ paymentId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Already refunded' });
    }

    const refund = await razorpay.payments.refund(payment.paymentId, {
      amount: (refundAmount ? refundAmount : payment.amount) * 100
    });

    payment.status = 'refunded';
    await payment.save();

    res.json({
      message: 'Refund processed successfully by admin',
      refund
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};