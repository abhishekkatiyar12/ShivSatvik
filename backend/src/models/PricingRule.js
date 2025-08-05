const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  season: String,
  startDate: Date,
  endDate: Date,
  priceMultiplier: Number
});

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
