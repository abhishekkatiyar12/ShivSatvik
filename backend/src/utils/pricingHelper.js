const PricingRule = require('../models/PricingRule');

exports.applyDynamicPricing = async (basePrice, checkIn) => {
  const rules = await PricingRule.find();
  const bookingDate = new Date(checkIn);
  
  for (const rule of rules) {
    if (bookingDate >= rule.startDate && bookingDate <= rule.endDate) {
      return basePrice * rule.priceMultiplier;
    }
  }
  return basePrice;
};
