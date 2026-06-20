// In-memory база данных с начальными данными
const db = {
  users: [
    {
      id: 'user_1',
      name: 'Иван Соколов',
      email: 'ivan@example.com',
      password: '$2a$10$hashedpassword', // в реальном проекте bcrypt
      role: 'author',
      avatar: 'ИС',
      createdAt: '2025-03-01'
    }
  ],
  
  content: [
    {
      id: 'c1',
      title: '10 принципов современного UI',
      type: 'article',
      views: 342,
      reactions: 28,
      revenue: '299 ₽',
      status: 'published',
      statusLabel: 'Опубликован',
      authorId: 'user_1',
      createdAt: '2026-06-15',
      scheduledFor: null,
      description: 'Современные принципы проектирования интерфейсов',
      tags: ['UI', 'дизайн', 'принципы'],
      access: 'free'
    },
    {
      id: 'c2',
      title: 'Урок по анимации в Figma',
      type: 'video',
      views: 1234,
      reactions: 56,
      revenue: 'Бесплатно',
      status: 'published',
      statusLabel: 'Опубликован',
      authorId: 'user_1',
      createdAt: '2026-06-12',
      scheduledFor: null,
      description: 'Анимация интерфейсов в Figma',
      tags: ['Figma', 'анимация', 'урок'],
      access: 'free'
    },
    {
      id: 'c3',
      title: 'Подкаст #11: тренды 2026',
      type: 'podcast',
      views: 890,
      reactions: 41,
      revenue: 'По подписке',
      status: 'published',
      statusLabel: 'Опубликован',
      authorId: 'user_1',
      createdAt: '2026-06-10',
      scheduledFor: null,
      description: 'Обсуждение главных трендов в дизайне',
      tags: ['подкаст', 'тренды', 'дизайн'],
      access: 'subscription'
    },
    {
      id: 'c4',
      title: 'Галерея референсов',
      type: 'gallery',
      views: 210,
      reactions: 18,
      revenue: '499 ₽',
      status: 'draft',
      statusLabel: 'Черновик',
      authorId: 'user_1',
      createdAt: '2026-06-08',
      scheduledFor: null,
      description: 'Подборка лучших референсов для дизайнеров',
      tags: ['референсы', 'галерея', 'вдохновение'],
      access: 'paid'
    },
    {
      id: 'c5',
      title: 'Аудиоразбор кейса Nike',
      type: 'audio',
      views: 0,
      reactions: 0,
      revenue: 'По подписке',
      status: 'scheduled',
      statusLabel: 'Запланирован',
      authorId: 'user_1',
      createdAt: '2026-06-05',
      scheduledFor: '2026-06-25T10:00:00',
      description: 'Анализ маркетингового кейса Nike',
      tags: ['кейс', 'маркетинг', 'Nike'],
      access: 'subscription'
    },
    {
      id: 'c6',
      title: 'Гайд по цветовым системам',
      type: 'article',
      views: 620,
      reactions: 33,
      revenue: '199 ₽',
      status: 'published',
      statusLabel: 'Опубликован',
      authorId: 'user_1',
      createdAt: '2026-06-01',
      scheduledFor: null,
      description: 'Как работать с цветовыми системами в дизайне',
      tags: ['цвет', 'системы', 'гайд'],
      access: 'paid'
    }
  ],

  tiers: [
    {
      id: 't1',
      name: 'Базовый',
      priceMonth: 199,
      priceYear: 1990,
      subscribers: 34,
      revenue: '6 766 ₽',
      color: 'base',
      description: 'Базовый доступ к контенту',
      benefits: ['Доступ к статьям', 'Комментарии']
    },
    {
      id: 't2',
      name: 'Премиум',
      priceMonth: 499,
      priceYear: 4990,
      subscribers: 28,
      revenue: '13 972 ₽',
      color: 'prem',
      description: 'Расширенный доступ',
      benefits: ['Все базовое', 'Видео-уроки', 'Закрытый чат']
    },
    {
      id: 't3',
      name: 'VIP',
      priceMonth: 1499,
      priceYear: 14990,
      subscribers: 5,
      revenue: '7 495 ₽',
      color: 'vip',
      description: 'Максимальный доступ',
      benefits: ['Все премиум', 'Персональные консультации', 'Ранний доступ']
    }
  ],

  subscribers: [
    {
      id: 's1',
      name: 'Алексей Морозов',
      email: 'alex@mail.ru',
      tierId: 't2',
      tierName: 'Премиум',
      since: '4 мес',
      paid: '1 996 ₽',
      lastActivity: 'сегодня',
      risk: 12,
      status: 'active'
    },
    {
      id: 's2',
      name: 'Мария Волкова',
      email: 'maria@gmail.com',
      tierId: 't3',
      tierName: 'VIP',
      since: '8 мес',
      paid: '11 992 ₽',
      lastActivity: 'вчера',
      risk: 8,
      status: 'active'
    },
    {
      id: 's3',
      name: 'Дмитрий Лебедев',
      email: 'dl@yandex.ru',
      tierId: 't1',
      tierName: 'Базовый',
      since: '2 мес',
      paid: '398 ₽',
      lastActivity: '32 дня назад',
      risk: 78,
      status: 'active'
    },
    {
      id: 's4',
      name: 'Ольга Соколова',
      email: 'olga@mail.ru',
      tierId: 't2',
      tierName: 'Премиум',
      since: '6 мес',
      paid: '2 994 ₽',
      lastActivity: '3 дня назад',
      risk: 34,
      status: 'active'
    },
    {
      id: 's5',
      name: 'Игорь Новиков',
      email: 'igor@gmail.com',
      tierId: 't1',
      tierName: 'Базовый',
      since: '1 мес',
      paid: '199 ₽',
      lastActivity: '45 дней назад',
      risk: 85,
      status: 'dormant'
    },
    {
      id: 's6',
      name: 'Елена Кузнецова',
      email: 'elena@mail.ru',
      tierId: 't2',
      tierName: 'Премиум',
      since: '3 мес',
      paid: '1 497 ₽',
      lastActivity: 'сегодня',
      risk: 15,
      status: 'active'
    }
  ],

  comments: [
    {
      id: 'cm1',
      author: 'Алексей М.',
      text: 'Отличный разбор! А будет вторая часть?',
      post: '10 принципов UI',
      status: 'pending',
      createdAt: '2026-06-19'
    },
    {
      id: 'cm2',
      author: 'Мария В.',
      text: 'Спасибо, всё по делу 🧡',
      post: 'Подкаст #11',
      status: 'pending',
      createdAt: '2026-06-18'
    },
    {
      id: 'cm3',
      author: 'Гость',
      text: 'Спам-ссылка...',
      post: 'Урок по анимации',
      status: 'pending',
      createdAt: '2026-06-17'
    }
  ],

  chats: [
    {
      id: 'ch1',
      subscriberId: 's1',
      subscriberName: 'Алексей Морозов',
      lastMessage: 'Спасибо за гайд, очень полезно!',
      unread: 2,
      timestamp: '2026-06-19T14:30:00'
    },
    {
      id: 'ch2',
      subscriberId: 's2',
      subscriberName: 'Мария Волкова',
      lastMessage: 'Когда будет следующий подкаст?',
      unread: 1,
      timestamp: '2026-06-19T12:15:00'
    },
    {
      id: 'ch3',
      subscriberId: 's4',
      subscriberName: 'Ольга Соколова',
      lastMessage: 'Спасибо за урок!',
      unread: 0,
      timestamp: '2026-06-18T16:45:00'
    }
  ],

  promoCodes: [
    {
      id: 'p1',
      code: 'SUMMER30',
      discount: '-30%',
      activations: 48,
      revenue: '16 700 ₽',
      validUntil: '2026-08-31',
      type: 'percentage',
      value: 30
    },
    {
      id: 'p2',
      code: 'WELCOME',
      discount: '-100 ₽',
      activations: 112,
      revenue: '38 200 ₽',
      validUntil: '2026-12-31',
      type: 'fixed',
      value: 100
    },
    {
      id: 'p3',
      code: 'VIP2026',
      discount: '-15%',
      activations: 9,
      revenue: '11 300 ₽',
      validUntil: '2026-07-15',
      type: 'percentage',
      value: 15
    }
  ],

  transactions: [
    {
      id: 'tr1',
      date: '2026-06-12',
      type: 'Оплата подписки',
      amount: '+499 ₽',
      status: 'completed',
      description: 'Подписка Премиум'
    },
    {
      id: 'tr2',
      date: '2026-06-11',
      type: 'Разовая покупка',
      amount: '+299 ₽',
      status: 'completed',
      description: 'Гайд по цветам'
    },
    {
      id: 'tr3',
      date: '2026-06-10',
      type: 'Вывод на карту',
      amount: '-15 000 ₽',
      status: 'processing',
      description: 'Вывод средств'
    },
    {
      id: 'tr4',
      date: '2026-06-09',
      type: 'Возврат',
      amount: '-499 ₽',
      status: 'pending',
      description: 'Возврат подписки'
    }
  ],

  newsletter: [
    {
      id: 'n1',
      subject: 'Новый гайд по Figma уже здесь',
      audience: 'Все подписчики',
      delivered: 67,
      opened: 49,
      clicked: 21,
      status: 'sent',
      createdAt: '2026-06-18'
    },
    {
      id: 'n2',
      subject: 'Скидка для возвращения 🧡',
      audience: 'Спящие',
      delivered: 13,
      opened: 5,
      clicked: 3,
      status: 'sent',
      createdAt: '2026-06-15'
    },
    {
      id: 'n3',
      subject: 'Анонс подкаста #12',
      audience: 'Премиум',
      delivered: 0,
      opened: 0,
      clicked: 0,
      status: 'scheduled',
      scheduledFor: '2026-06-25'
    }
  ]
};

// Вспомогательные функции
const generateId = () => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const findUserById = (id) => {
  return db.users.find(u => u.id === id);
};

const getSubscriberStats = () => {
  const total = db.subscribers.length;
  const active = db.subscribers.filter(s => s.status === 'active').length;
  const dormant = db.subscribers.filter(s => s.status === 'dormant').length;
  return { total, active, dormant };
};

module.exports = {
  db,
  generateId,
  findUserById,
  getSubscriberStats
};