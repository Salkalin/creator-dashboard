const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Content = require('../models/Content');
const Tier = require('../models/Tier');
const Subscriber = require('../models/Subscriber');
const Transaction = require('../models/Transaction');
const PromoCode = require('../models/PromoCode');
const Comment = require('../models/Comment');

// Начальные данные
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Подключено к MongoDB');

    // Очистка старых данных
    await User.deleteMany({});
    await Content.deleteMany({});
    await Tier.deleteMany({});
    await Subscriber.deleteMany({});
    await Transaction.deleteMany({});
    await PromoCode.deleteMany({});
    await Comment.deleteMany({});
    console.log('🗑️ Старые данные удалены');

    // Создание пользователя
    const user = new User({
      name: 'Иван Соколов',
      email: 'ivan@example.com',
      password: 'hashed_password',
      role: 'author',
      avatar: 'ИС',
      description: 'Дизайн и анимация',
    });
    await user.save();
    console.log('👤 Пользователь создан');

    // Создание уровней подписки
    const tiers = await Tier.insertMany([
      {
        name: 'Базовый',
        priceMonth: 199,
        priceYear: 1990,
        description: 'Базовый доступ к контенту',
        benefits: ['Доступ к статьям', 'Комментарии'],
        color: 'base',
        subscribers: 34,
        revenue: 6766,
        isActive: true
      },
      {
        name: 'Премиум',
        priceMonth: 499,
        priceYear: 4990,
        description: 'Расширенный доступ',
        benefits: ['Все базовое', 'Видео-уроки', 'Закрытый чат'],
        color: 'prem',
        subscribers: 28,
        revenue: 13972,
        isActive: true
      },
      {
        name: 'VIP',
        priceMonth: 1499,
        priceYear: 14990,
        description: 'Максимальный доступ',
        benefits: ['Все премиум', 'Персональные консультации', 'Ранний доступ'],
        color: 'vip',
        subscribers: 5,
        revenue: 7495,
        isActive: true
      }
    ]);
    console.log('📊 Уровни подписки созданы');

    // Создание подписчиков
    const subscribers = await Subscriber.insertMany([
      {
        name: 'Алексей Морозов',
        email: 'alex@mail.ru',
        tierId: tiers[1]._id,
        tierName: 'Премиум',
        since: new Date('2026-02-01'),
        paid: 1996,
        lastActivity: new Date(),
        risk: 12,
        status: 'active'
      },
      {
        name: 'Мария Волкова',
        email: 'maria@gmail.com',
        tierId: tiers[2]._id,
        tierName: 'VIP',
        since: new Date('2025-10-01'),
        paid: 11992,
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
        risk: 8,
        status: 'active'
      },
      {
        name: 'Дмитрий Лебедев',
        email: 'dl@yandex.ru',
        tierId: tiers[0]._id,
        tierName: 'Базовый',
        since: new Date('2026-04-01'),
        paid: 398,
        lastActivity: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000),
        risk: 78,
        status: 'active'
      },
      {
        name: 'Ольга Соколова',
        email: 'olga@mail.ru',
        tierId: tiers[1]._id,
        tierName: 'Премиум',
        since: new Date('2025-12-01'),
        paid: 2994,
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        risk: 34,
        status: 'active'
      },
      {
        name: 'Игорь Новиков',
        email: 'igor@gmail.com',
        tierId: tiers[0]._id,
        tierName: 'Базовый',
        since: new Date('2026-05-01'),
        paid: 199,
        lastActivity: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        risk: 85,
        status: 'dormant'
      },
      {
        name: 'Елена Кузнецова',
        email: 'elena@mail.ru',
        tierId: tiers[1]._id,
        tierName: 'Премиум',
        since: new Date('2026-03-01'),
        paid: 1497,
        lastActivity: new Date(),
        risk: 15,
        status: 'active'
      }
    ]);
    console.log('👥 Подписчики созданы');

    // Создание контента
    const content = await Content.insertMany([
      {
        title: '10 принципов современного UI',
        type: 'article',
        description: 'Современные принципы проектирования интерфейсов',
        tags: ['UI', 'дизайн', 'принципы'],
        access: 'free',
        price: 0,
        status: 'published',
        views: 342,
        reactions: 28,
        revenue: 299,
        authorId: user._id,
        createdAt: new Date('2026-06-15'),
      },
      {
        title: 'Урок по анимации в Figma',
        type: 'video',
        description: 'Анимация интерфейсов в Figma',
        tags: ['Figma', 'анимация', 'урок'],
        access: 'free',
        price: 0,
        status: 'published',
        views: 1234,
        reactions: 56,
        revenue: 0,
        authorId: user._id,
        createdAt: new Date('2026-06-12'),
      },
      {
        title: 'Подкаст #11: тренды 2026',
        type: 'podcast',
        description: 'Обсуждение главных трендов в дизайне',
        tags: ['подкаст', 'тренды', 'дизайн'],
        access: 'subscription',
        price: 0,
        status: 'published',
        views: 890,
        reactions: 41,
        revenue: 0,
        authorId: user._id,
        createdAt: new Date('2026-06-10'),
      },
      {
        title: 'Галерея референсов',
        type: 'gallery',
        description: 'Подборка лучших референсов для дизайнеров',
        tags: ['референсы', 'галерея', 'вдохновение'],
        access: 'paid',
        price: 499,
        status: 'draft',
        views: 210,
        reactions: 18,
        revenue: 499,
        authorId: user._id,
        createdAt: new Date('2026-06-08'),
      },
      {
        title: 'Аудиоразбор кейса Nike',
        type: 'audio',
        description: 'Анализ маркетингового кейса Nike',
        tags: ['кейс', 'маркетинг', 'Nike'],
        access: 'subscription',
        price: 0,
        status: 'scheduled',
        views: 0,
        reactions: 0,
        revenue: 0,
        authorId: user._id,
        scheduledFor: new Date('2026-06-25T10:00:00'),
        createdAt: new Date('2026-06-05'),
      },
      {
        title: 'Гайд по цветовым системам',
        type: 'article',
        description: 'Как работать с цветовыми системами в дизайне',
        tags: ['цвет', 'системы', 'гайд'],
        access: 'paid',
        price: 199,
        status: 'published',
        views: 620,
        reactions: 33,
        revenue: 199,
        authorId: user._id,
        createdAt: new Date('2026-06-01'),
      }
    ]);
    console.log('📝 Контент создан');

    // Создание транзакций
    await Transaction.insertMany([
      {
        type: 'subscription',
        amount: 499,
        description: 'Подписка Премиум',
        status: 'completed',
        userId: user._id,
        createdAt: new Date('2026-06-12')
      },
      {
        type: 'one_time',
        amount: 299,
        description: 'Гайд по цветам',
        status: 'completed',
        userId: user._id,
        createdAt: new Date('2026-06-11')
      },
      {
        type: 'withdrawal',
        amount: 15000,
        description: 'Вывод средств',
        status: 'processing',
        userId: user._id,
        createdAt: new Date('2026-06-10')
      },
      {
        type: 'refund',
        amount: 499,
        description: 'Возврат подписки',
        status: 'pending',
        userId: user._id,
        createdAt: new Date('2026-06-09')
      }
    ]);
    console.log('💰 Транзакции созданы');

    // Создание промокодов
    await PromoCode.insertMany([
      {
        code: 'SUMMER30',
        type: 'percentage',
        value: 30,
        activations: 48,
        revenue: 16700,
        validUntil: new Date('2026-08-31'),
        limit: 100,
        isActive: true
      },
      {
        code: 'WELCOME',
        type: 'fixed',
        value: 100,
        activations: 112,
        revenue: 38200,
        validUntil: new Date('2026-12-31'),
        limit: 200,
        isActive: true
      },
      {
        code: 'VIP2026',
        type: 'percentage',
        value: 15,
        activations: 9,
        revenue: 11300,
        validUntil: new Date('2026-07-15'),
        limit: 50,
        isActive: true
      }
    ]);
    console.log('🎫 Промокоды созданы');

    // Создание комментариев
    await Comment.insertMany([
      {
        author: 'Алексей М.',
        text: 'Отличный разбор! А будет вторая часть?',
        post: '10 принципов UI',
        postId: content[0]._id,
        status: 'pending',
        createdAt: new Date('2026-06-19')
      },
      {
        author: 'Мария В.',
        text: 'Спасибо, всё по делу 🧡',
        post: 'Подкаст #11',
        postId: content[2]._id,
        status: 'pending',
        createdAt: new Date('2026-06-18')
      },
      {
        author: 'Гость',
        text: 'Спам-ссылка...',
        post: 'Урок по анимации',
        postId: content[1]._id,
        status: 'pending',
        createdAt: new Date('2026-06-17')
      }
    ]);
    console.log('💬 Комментарии созданы');

    console.log('✅ Все данные успешно загружены!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  }
};

seedData();