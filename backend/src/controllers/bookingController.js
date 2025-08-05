const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Razorpay = require('razorpay');
const { sendEmail } = require('../utils/sendEmail');
const { sendSMS } = require('../utils/smsService');
const Flat = require('../models/Flat');
const User = require('../models/User');
const { applyDynamicPricing } = require('../utils/pricingHelper');
const { applyCoupon } = require('../utils/couponHelper');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * ✅ Create Booking (Pending + Razorpay Order)
 */
exports.createBooking = async (req, res) => {
  try {
    const { flatId, checkIn, checkOut, guests, couponCode } = req.body;

    // ✅ Fetch flat details
    const flat = await Flat.findById(flatId);
    if (!flat) return res.status(404).json({ message: 'Flat not found' });

    // ✅ Calculate total nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const totalNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (totalNights <= 0) return res.status(400).json({ message: 'Invalid check-in/check-out dates' });

    // ✅ Apply dynamic pricing
    let pricePerNight = await applyDynamicPricing(flat.pricePerNight, checkIn);
    let totalAmount = pricePerNight * totalNights;

    // ✅ Apply coupon if provided
    if (couponCode) {
      totalAmount = await applyCoupon(couponCode, totalAmount);
    }

    // ✅ Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });

    // ✅ Save booking in DB (status: pending)
    const booking = await Booking.create({
      user: req.user.id,
      flat: flatId,
      checkIn,
      checkOut,
      guests,
      amount: totalAmount,
      status: 'pending',
      razorpayOrderId: razorpayOrder.id
    });

    res.json({
      message: 'Booking created. Complete payment to confirm.',
      booking,
      razorpayOrder
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Cancel Booking & Refund
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { reason, refundAmount } = req.body;
    const booking = await Booking.findById(req.params.id).populate('user');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = reason || 'No reason provided';
    await booking.save();

    const payment = await Payment.findOne({ booking: booking._id });
    let refundDetails = null;

    if (payment && payment.status === 'paid') {
      try {
        const refund = await razorpay.payments.refund(payment.paymentId, {
          amount: (refundAmount ? refundAmount : booking.amount) * 100
        });

        payment.status = 'refunded';
        payment.refundId = refund.id;
        payment.refundAmount = refund.amount / 100;
        await payment.save();

        refundDetails = refund;

      } catch (refundError) {
        console.error('Refund Error:', refundError);
        return res.status(500).json({ message: 'Booking cancelled but refund failed', error: refundError.message });
      }
    }

    // ✅ Send Email
    await sendEmail(
      booking.user.email,
      'Booking Cancellation - ShivSatvik Homestay',
      `
        <h3>Hello ${booking.user.name},</h3>
        <p>Your booking for Flat ID ${booking.flat} has been cancelled.</p>
        <p>Reason: ${booking.cancellationReason}</p>
        ${refundDetails ? `<p>Refund of ₹${refundDetails.amount / 100} has been processed.</p>` : '<p>No refund applicable.</p>'}
        <p>Thank you for using ShivSatvik Homestay.</p>
      `
    );

    if (booking.user.phone) {
      await sendSMS(booking.user.phone, `Booking cancelled. Refund: ₹${refundDetails ? refundDetails.amount / 100 : 0}`);
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking,
      refund: refundDetails
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
