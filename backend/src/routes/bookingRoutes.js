const express = require('express');
const { createBooking, cancelBooking  } = require('../controllers/bookingController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, createBooking);
router.put('/:id/cancel', auth, cancelBooking);

module.exports = router;
