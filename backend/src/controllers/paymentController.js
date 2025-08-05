const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendEmail } = require('../utils/sendEmail');
const User = require('../models/User');
const Flat = require('../models/Flat');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * ✅ Create Razorpay Order
 */
exports.createOrder = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    await Payment.create({
      booking: bookingId,
      orderId: order.id,
      status: 'created'
    });

    res.json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Verify Payment & Send Email
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      // ✅ Update Payment & Booking
      const payment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { paymentId: razorpay_payment_id, signature: razorpay_signature, status: 'paid' },
        { new: true }
      );

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: 'paid' },
        { new: true }
      ).populate('user').populate('flat');

      // ✅ Send Email Confirmation
      if (booking && booking.user && booking.user.email) {
        await sendEmail(
          booking.user.email,
          'Payment Confirmation - ShivSatvik Homestay',
          `
            <h3>Hello ${booking.user.name},</h3>
            <p>Your payment for <strong>${booking.flat.type}</strong> has been successfully received.</p>
            <p><strong>Booking Details:</strong></p>
            <ul>
              <li>Check-in: ${booking.checkIn}</li>
              <li>Check-out: ${booking.checkOut}</li>
              <li>Guests: ${booking.guests}</li>
              <li>Amount Paid: ₹${booking.amount}</li>
            </ul>
            <p>Thank you for choosing ShivSatvik Homestay!</p>
          `
        );
      }

      return res.json({ success: true, message: 'Payment verified and booking confirmed', payment, booking });
    } else {
      return res.status(400).json({ message: 'Invalid signature, payment verification failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
