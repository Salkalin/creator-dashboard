const mongoose = require('mongoose');

async function testConnection() {
  try {
    await mongoose.connect('mongodb://localhost:27017/creator_dashboard');
    console.log('✅ Подключено к MongoDB через Compass!');
    
    // Создаём тестовую коллекцию
    const testSchema = new mongoose.Schema({
      test: String,
      createdAt: Date
    });
    const Test = mongoose.model('Test', testSchema);
    
    // Добавляем тестовую запись
    await Test.create({
      test: 'Привет из Compass!',
      createdAt: new Date()
    });
    console.log('✅ Тестовая запись создана!');
    
    // Проверяем, что запись появилась в Compass
    const all = await Test.find();
    console.log('📊 Записи в базе:', all);
    
    await mongoose.disconnect();
    console.log('✅ Отключено');
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testConnection();