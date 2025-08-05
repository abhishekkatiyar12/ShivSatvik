const express = require('express');
const {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');

const auth = require('../middleware/auth');
const role = require('../middleware/role');

const router = express.Router();

// Admin-only coupon management routes
router.post('/', auth, role('admin'), createCoupon);     // Create a coupon
router.get('/', auth, role('admin'), getAllCoupons);    // Get all coupons
router.get('/:id', auth, role('admin'), getCouponById); // Get single coupon
router.put('/:id', auth, role('admin'), updateCoupon);  // Update coupon
router.delete('/:id', auth, role('admin'), deleteCoupon); // Delete coupon

module.exports = router;
