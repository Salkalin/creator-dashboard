const express = require('express');
const router = express.Router();
const { db, generateId } = require('../data/db');

// Получение финансовой сводки
router.get('/summary', (req, res) => {
  try {
    const available = 42891;
    const reserved = 8400;
    const processing = 3100;
    const totalEarned = 487250;
    
    const fees = {
      subscription: 4280,
      oneTime: 1120,
      withdrawal: 150
    };
    
    res.json({
      success: true,
      data: {
        available,
        reserved,
        processing,
        totalEarned,
        fees,
        platformFee: 10.5
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение транзакций
router.get('/transactions', (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const transactions = db.transactions.slice(offset, offset + limit);
    
    res.json({
      success: true,
      data: transactions,
      pagination: {
        total: db.transactions.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Запрос на вывод средств
router.post('/withdraw', (req, res) => {
  try {
    const { amount, method } = req.body;
    
    if (!amount || amount < 500) {
      return res.status(400).json({ 
        success: false, 
        message: 'Минимальная сумма вывода — 500 ₽' 
      });
    }
    
    const available = 42891;
    if (amount > available) {
      return res.status(400).json({ 
        success: false, 
        message: `Недостаточно средств. Доступно: ${available} ₽` 
      });
    }
    
    const withdrawal = {
      id: generateId(),
      amount: amount,
      method: method || 'Карта',
      status: 'processing',
      requestedAt: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    res.json({
      success: true,
      data: withdrawal,
      message: 'Заявка на вывод принята'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; // ✅ ВАЖНО: экспортируем router