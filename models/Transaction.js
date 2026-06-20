const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['subscription', 'one_time', 'withdrawal', 'refund'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'processing', 'failed'],
    default: 'completed',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  subscriberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscriber',
    default: null,
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Виртуальное поле для отображения суммы со знаком
TransactionSchema.virtual('amountDisplay').get(function() {
  const sign = this.type === 'withdrawal' || this.type === 'refund' ? '-' : '+';
  return `${sign}${this.amount} ₽`;
});

module.exports = mongoose.model('Transaction', TransactionSchema);