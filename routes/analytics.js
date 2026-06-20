const express = require('express');
const router = express.Router();
const { db } = require('../data/db');

// Основные метрики
router.get('/metrics', (req, res) => {
  try {
    const totalSubscribers = db.subscribers.length;
    const totalRevenue = db.transactions
      .filter(t => t.amount.includes('+'))
      .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.]/g, '')), 0);
    
    const arpu = totalSubscribers > 0 ? Math.round(totalRevenue / totalSubscribers) : 0;
    
    res.json({
      success: true,
      data: {
        arpu,
        ltv: 3870,
        churn: 4.2,
        conversion: 8.4
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Воронка конверсии
router.get('/funnel', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        steps: [
          { name: 'Посетители профиля', value: 12400, percentage: 100 },
          { name: 'Кликнули на подписку', value: 5208, percentage: 42 },
          { name: 'Начали оформление', value: 2604, percentage: 21 },
          { name: 'Успешно оплатили', value: 1042, percentage: 8.4 }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Когортный анализ
router.get('/cohorts', (req, res) => {
  try {
    res.json({
      success: true,
      data: [
        { cohort: 'Янв 2026', start: 100, month1: 82, month3: 61, month6: 48 },
        { cohort: 'Фев 2026', start: 100, month1: 85, month3: 64, month6: null },
        { cohort: 'Мар 2026', start: 100, month1: 88, month3: null, month6: null },
        { cohort: 'Апр 2026', start: 100, month1: 91, month3: null, month6: null }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; // ✅ ВАЖНО: экспортируем router