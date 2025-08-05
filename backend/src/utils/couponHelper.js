const Coupon = require('../models/Coupon');

exports.applyCoupon = async (code, amount) => {
  const coupon = await Coupon.findOne({ code });
  if (!coupon) throw new Error('Invalid coupon');
  if (coupon.expiryDate < new Date()) throw new Error('Coupon expired');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new Error('Coupon usage limit reached');

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (amount * coupon.value) / 100;
  } else {
    discount = coupon.value;
  }

  coupon.usedCount++;
  await coupon.save();

  return amount - discount;
};
