const Coupon = require('../models/Coupon');

// ✅ Create Coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discountType, value, usageLimit, expiryDate } = req.body;

    const existing = await Coupon.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Coupon code already exists' });

    const coupon = await Coupon.create({ code, discountType, value, usageLimit, expiryDate });
    res.json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get All Coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Coupon by ID
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Coupon
exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ message: 'Coupon updated successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Coupon
exports.deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
