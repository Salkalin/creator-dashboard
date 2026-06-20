const express = require('express');
const router = express.Router();
const { db, generateId } = require('../data/db');

// Получение рассылок
router.get('/newsletter', (req, res) => {
  try {
    res.json({
      success: true,
      data: db.newsletter
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение чатов
router.get('/chats', (req, res) => {
  try {
    res.json({
      success: true,
      data: db.chats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение комментариев
router.get('/comments', (req, res) => {
  try {
    const { status } = req.query;
    let comments = [...db.comments];
    
    if (status) {
      comments = comments.filter(c => c.status === status);
    }
    
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Модерация комментария
router.put('/comments/:id', (req, res) => {
  try {
    const { status } = req.body;
    const comment = db.comments.find(c => c.id === req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Комментарий не найден' });
    }
    
    comment.status = status;
    
    res.json({
      success: true,
      data: comment,
      message: status === 'approved' ? 'Комментарий одобрен' : 'Комментарий отклонён'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; // ✅ ВАЖНО: экспортируем router