const mongoose = require('mongoose');

const connectDB = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      console.log(`✅ MongoDB подключена: ${conn.connection.host}`);
      console.log(`📊 База данных: ${conn.connection.name}`);
      return;
    } catch (error) {
      console.error(`❌ Попытка ${i + 1}/${retries} — MongoDB недоступна: ${error.message}`);
      if (i < retries - 1) {
        console.log(`⏳ Повтор через ${delay / 1000}с...`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  console.error('❌ Не удалось подключиться к MongoDB после всех попыток');
  process.exit(1);
};

module.exports = connectDB;