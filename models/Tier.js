const mongoose = require('mongoose');

const TierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  priceMonth: {
    type: Number,
    required: true,
    min: 0,
  },
  priceYear: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    default: '',
  },
  benefits: {
    type: [String],
    default: [],
  },
  color: {
    type: String,
    enum: ['base', 'prem', 'vip'],
    default: 'base',
  },
  subscribers: {
    type: Number,
    default: 0,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tier', TierSchema);