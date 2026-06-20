const express = require('express');
const router = express.Router();
const { db } = require('../data/db');

// Логин
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Неверный email или пароль' 
      });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Регистрация
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Пользователь уже существует' 
      });
    }
    
    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password: 'hashed_password',
      role: 'author',
      avatar: name.split(' ').map(n => n[0]).join(''),
      createdAt: new Date().toISOString()
    };
    
    db.users.push(newUser);
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          avatar: newUser.avatar
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получение профиля
router.get('/profile', (req, res) => {
  try {
    const user = db.users[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }
    
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; // ✅ ВАЖНО: экспортируем router