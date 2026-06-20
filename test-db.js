const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/creator_dashboard';

async function testConnection() {
  try {
    console.log('🔌 Подключаюсь к MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Подключено успешно!');
    
    // Показываем информацию
    console.log('📊 База данных:', mongoose.connection.name);
    console.log('🔗 Хост:', mongoose.connection.host);
    
    // Создаём тестовую запись
    const testSchema = new mongoose.Schema({
      name: String,
      email: String,
      createdAt: Date
    });
    const Test = mongoose.model('Test', testSchema);
    
    await Test.create({
      name: 'Тестовый пользователь',
      email: 'test@example.com',
      createdAt: new Date()
    });
    console.log('✅ Тестовая запись создана!');
    
    // Проверяем, что запись появилась
    const count = await Test.countDocuments();
    console.log('📊 Всего записей в коллекции:', count);
    
    await mongoose.disconnect();
    console.log('✅ Отключено от базы');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

testConnection();