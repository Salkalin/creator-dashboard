const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  tierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tier',
    required: true,
  },
  tierName: {
    type: String,
    required: true,
  },
  since: {
    type: Date,
    default: Date.now,
  },
  paid: {
    type: Number,
    default: 0,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  risk: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'dormant', 'inactive'],
    default: 'active',
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

module.exports = mongoose.model('Subscriber', SubscriberSchema);