const express = require('express');
const router = express.Router();
const Content = require('../models/Content');
const Subscriber = require('../models/Subscriber');
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    // Получаем общее количество подписчиков
    const totalSubscribers = await Subscriber.countDocuments();
    const activeSubscribers = await Subscriber.countDocuments({ status: 'active' });
    
    // Получаем топ-контент по доходам
    const topContent = await Content.find({ status: 'published' })
      .sort({ revenue: -1 })
      .limit(5)
      .select('title type revenue views');

    // Получаем общую выручку
    const transactions = await Transaction.find({ 
      type: { $in: ['subscription', 'one_time'] },
      status: 'completed'
    });
    
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    // Средний чек
    const avgCheck = transactions.length > 0 
      ? Math.round(totalRevenue / transactions.length) 
      : 0;

    // Доступно к выводу
    const withdrawals = await Transaction.find({ type: 'withdrawal', status: 'pending' });
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);
    const availableWithdraw = Math.max(0, totalRevenue - totalWithdrawals);

    // Прогноз
    const forecast = Math.round(totalRevenue * 1.15);

    // Данные для графика (последние 30 дней)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          type: { $in: ['subscription', 'one_time'] },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const chartData = dailyRevenue.map(d => ({
      day: new Date(d._id).getDate(),
      revenue: d.total
    }));

    res.json({
      success: true,
      data: {
        metrics: {
          monthlyRevenue: totalRevenue,
          activeSubscriptions: activeSubscribers,
          avgCheck: avgCheck,
          availableWithdraw: availableWithdraw
        },
        trend: {
          monthlyRevenue: 12,
          subscriptions: 5,
          avgCheck: -2
        },
        topContent,
        chartData,
        forecast,
        insight: {
          text: 'Ваш подкаст про дизайн собрал на 30% больше прослушиваний, чем в прошлом месяце. Попробуйте выпустить второй выпуск в ближайшие 3 дня.',
          action: 'Подробнее'
        }
      }
    });
  } catch (error) {
    console.error('Ошибка получения дашборда:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;