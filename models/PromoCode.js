const mongoose = require('mongoose');

const PromoSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  activations: {
    type: Number,
    default: 0,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  validUntil: {
    type: Date,
    required: true,
  },
  limit: {
    type: Number,
    default: 100,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Виртуальное поле для отображения скидки
PromoSchema.virtual('discountDisplay').get(function() {
  if (this.type === 'percentage') return `-${this.value}%`;
  return `-${this.value} ₽`;
});

module.exports = mongoose.model('PromoCode', PromoSchema);