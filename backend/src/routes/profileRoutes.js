const express = require('express');
const { getProfile, updateProfile, getUserBookings, getPaymentHistory } = require('../controllers/profileController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.get('/bookings', auth, getUserBookings);
router.get('/payments', auth, getPaymentHistory);

module.exports = router;
