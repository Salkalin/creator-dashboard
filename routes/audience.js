const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

// Получение списка подписчиков
router.get('/subscribers', async (req, res) => {
  try {
    const { status, tierId } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (tierId) filter.tierId = tierId;
    
    const subscribers = await Subscriber.find(filter)
      .populate('tierId', 'name color')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: subscribers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение статистики по подписчикам
router.get('/stats', async (req, res) => {
  try {
    const total = await Subscriber.countDocuments();
    const active = await Subscriber.countDocuments({ status: 'active' });
    const dormant = await Subscriber.countDocuments({ status: 'dormant' });
    const highRisk = await Subscriber.countDocuments({ risk: { $gt: 60 } });
    
    res.json({
      success: true,
      data: {
        total,
        active,
        dormant,
        highRisk,
        activeRate: total > 0 ? Math.round((active / total) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение подписчика по ID
router.get('/subscribers/:id', async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id)
      .populate('tierId', 'name color description');
    
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Подписчик не найден' });
    }
    
    res.json({
      success: true,
      data: subscriber
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Обновление уровня подписчика
router.put('/subscribers/:id/tier', async (req, res) => {
  try {
    const { tierId } = req.body;
    const subscriber = await Subscriber.findById(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Подписчик не найден' });
    }
    
    // Получаем информацию о уровне
    const Tier = require('../models/Tier');
    const tier = await Tier.findById(tierId);
    if (!tier) {
      return res.status(404).json({ success: false, message: 'Уровень подписки не найден' });
    }
    
    subscriber.tierId = tierId;
    subscriber.tierName = tier.name;
    await subscriber.save();
    
    // Обновляем количество подписчиков у уровня
    tier.subscribers += 1;
    await tier.save();
    
    res.json({
      success: true,
      data: subscriber,
      message: 'Уровень подписчика обновлён'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение истории активности подписчика
router.get('/subscribers/:id/activity', async (req, res) => {
  try {
    // В реальном проекте здесь были бы данные из коллекции активности
    const activities = [
      {
        type: 'view',
        title: 'Прочитал «10 принципов UI»',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'reaction',
        title: 'Лайкнул подкаст #11',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'comment',
        title: 'Оставил комментарий',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];
    
    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Отправка сообщения подписчику
router.post('/subscribers/:id/message', async (req, res) => {
  try {
    const { message } = req.body;
    const subscriber = await Subscriber.findById(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Подписчик не найден' });
    }
    
    // В реальном проекте здесь отправка email/уведомления
    res.json({
      success: true,
      message: 'Сообщение отправлено подписчику',
      data: {
        to: subscriber.email,
        name: subscriber.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;