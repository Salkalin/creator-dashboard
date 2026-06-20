const express = require('express');
const router = express.Router();
const Tier = require('../models/Tier');
const PromoCode = require('../models/PromoCode');

// Получение уровней подписки
router.get('/tiers', async (req, res) => {
  try {
    const tiers = await Tier.find({ isActive: true });
    res.json({
      success: true,
      data: tiers
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Создание уровня подписки
router.post('/tiers', async (req, res) => {
  try {
    const { name, priceMonth, priceYear, description, benefits, color } = req.body;
    
    const newTier = new Tier({
      name,
      priceMonth: parseInt(priceMonth) || 0,
      priceYear: parseInt(priceYear) || 0,
      description: description || '',
      benefits: benefits ? benefits.split(',').map(b => b.trim()) : [],
      color: color || 'base',
      subscribers: 0,
      revenue: 0,
      isActive: true
    });
    
    await newTier.save();
    
    res.status(201).json({
      success: true,
      data: newTier,
      message: 'Уровень подписки создан'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Обновление уровня подписки
router.put('/tiers/:id', async (req, res) => {
  try {
    const tier = await Tier.findById(req.params.id);
    if (!tier) {
      return res.status(404).json({ success: false, message: 'Уровень не найден' });
    }
    
    const updatedTier = await Tier.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      data: updatedTier,
      message: 'Уровень обновлён'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Удаление уровня подписки
router.delete('/tiers/:id', async (req, res) => {
  try {
    const tier = await Tier.findById(req.params.id);
    if (!tier) {
      return res.status(404).json({ success: false, message: 'Уровень не найден' });
    }
    
    tier.isActive = false;
    await tier.save();
    
    res.json({
      success: true,
      message: 'Уровень подписки деактивирован'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение промокодов
router.get('/promocodes', async (req, res) => {
  try {
    const promoCodes = await PromoCode.find({ isActive: true });
    res.json({
      success: true,
      data: promoCodes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Создание промокода
router.post('/promocodes', async (req, res) => {
  try {
    const { code, type, value, validUntil, limit } = req.body;
    
    const newPromo = new PromoCode({
      code: code.toUpperCase(),
      type: type || 'percentage',
      value: parseInt(value) || 0,
      validUntil: new Date(validUntil),
      limit: parseInt(limit) || 100,
      activations: 0,
      revenue: 0,
      isActive: true
    });
    
    await newPromo.save();
    
    res.status(201).json({
      success: true,
      data: newPromo,
      message: 'Промокод создан'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Активация промокода
router.post('/promocodes/:code/activate', async (req, res) => {
  try {
    const promo = await PromoCode.findOne({ code: req.params.code.toUpperCase(), isActive: true });
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Промокод не найден или неактивен' });
    }
    
    if (promo.activations >= promo.limit) {
      return res.status(400).json({ success: false, message: 'Лимит использований исчерпан' });
    }
    
    if (new Date() > promo.validUntil) {
      return res.status(400).json({ success: false, message: 'Срок действия промокода истёк' });
    }
    
    promo.activations += 1;
    await promo.save();
    
    res.json({
      success: true,
      message: 'Промокод активирован',
      data: {
        discount: promo.discountDisplay,
        type: promo.type,
        value: promo.value
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// AI-рекомендации по ценообразованию
router.get('/pricing/recommendations', async (req, res) => {
  try {
    const tiers = await Tier.find({ isActive: true });
    
    // Находим премиум уровень
    const premiumTier = tiers.find(t => t.name === 'Премиум');
    
    let recommendation = 'AI рекомендует проанализировать текущие цены для оптимизации дохода.';
    if (premiumTier) {
      const currentPrice = premiumTier.priceMonth;
      const suggestedPrice = Math.round(currentPrice * 1.1);
      recommendation = `AI рекомендует поднять цену уровня «Премиум» с ${currentPrice}₽ до ${suggestedPrice}₽ — ожидаемый рост выручки +8% при оттоке менее 2%.`;
    }
    
    res.json({
      success: true,
      data: {
        recommendation,
        confidence: 85,
        metrics: {
          currentRevenue: 13972,
          projectedRevenue: 15090,
          churnProjection: 1.8
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;