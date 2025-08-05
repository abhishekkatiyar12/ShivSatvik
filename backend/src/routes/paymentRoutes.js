const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create Razorpay order
router.post('/create-order', auth, createOrder);

// Verify payment
router.post('/verify-payment', auth, verifyPayment);

module.exports = router;
