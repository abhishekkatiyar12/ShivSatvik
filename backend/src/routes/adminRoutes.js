const express = require('express');
const { getDashboardStats, getAllBookings,adminRefund } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

router.get('/stats', auth, role('admin'), getDashboardStats);
router.get('/bookings', auth, role('admin'), getAllBookings);
router.post('/refund', auth, role('admin'), adminRefund);


module.exports = router;
