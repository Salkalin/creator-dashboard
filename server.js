const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

// Подключение к базе данных
const connectDB = require('./config/database');

// Импорт роутов
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const contentRoutes = require('./routes/content');
const monetizationRoutes = require('./routes/monetization');
const audienceRoutes = require('./routes/audience');
const communicationsRoutes = require('./routes/communications');
const analyticsRoutes = require('./routes/analytics');
const financeRoutes = require('./routes/finance');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// ПОДКЛЮЧЕНИЕ К MONGODB
// ============================================

connectDB();

// ============================================
// НАСТРОЙКА ЗАГРУЗКИ ФАЙЛОВ
// ============================================

// Создаём папки для загрузок (с поддержкой Docker)
const uploadDir = path.join(__dirname, 'uploads');
const videoDir = path.join(uploadDir, 'videos');
const imageDir = path.join(uploadDir, 'images');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
}
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Настройка хранилища для видео
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, videoDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    }
});

// Настройка хранилища для изображений
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    }
});

// Фильтр для видео
const videoFilter = (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Только видеофайлы разрешены!'), false);
    }
};

// Фильтр для изображений
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Только изображения разрешены!'), false);
    }
};

const uploadVideo = multer({
    storage: videoStorage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: videoFilter
});

const uploadImage = multer({
    storage: imageStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: imageFilter
});

// ============================================
// MIDDLEWARE
// ============================================

// CORS для Docker и внешних запросов
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ 
    extended: true,
    limit: '50mb',
    parameterLimit: 50000
}));

// Статические папки
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

// ============================================
// МАРШРУТЫ ЗАГРУЗКИ
// ============================================

// Загрузка видео
app.post('/api/upload/video', uploadVideo.single('video'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Файл не загружен'
            });
        }

        res.json({
            success: true,
            data: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                url: `/uploads/videos/${req.file.filename}`,
                size: req.file.size,
                mimetype: req.file.mimetype,
                type: 'video'
            },
            message: 'Видео успешно загружено!'
        });
    } catch (error) {
        console.error('❌ Ошибка загрузки видео:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Ошибка при загрузке файла'
        });
    }
});

// Загрузка изображений
app.post('/api/upload/images', uploadImage.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Файлы не загружены'
            });
        }

        const files = req.files.map(file => ({
            filename: file.filename,
            originalName: file.originalname,
            url: `/uploads/images/${file.filename}`,
            size: file.size,
            mimetype: file.mimetype,
            type: 'image'
        }));

        res.json({
            success: true,
            data: files,
            message: `${files.length} изображений успешно загружено!`
        });
    } catch (error) {
        console.error('❌ Ошибка загрузки изображений:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Ошибка при загрузке файлов'
        });
    }
});

// ============================================
// ЛОГИРОВАНИЕ ЗАПРОСОВ
// ============================================

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ============================================
// AUTH MIDDLEWARE
// ============================================

const authMiddleware = async (req, res, next) => {
    try {
        const User = require('./models/User');
        let user = await User.findOne({ email: 'ivan@example.com' });
        if (!user) {
            user = new User({
                name: 'Иван Соколов',
                email: 'ivan@example.com',
                password: 'hashed_password',
                role: 'author',
                avatar: 'ИС',
            });
            await user.save();
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('❌ Ошибка auth middleware:', error);
        // Продолжаем без авторизации для тестирования
        req.user = {
            _id: 'test_user_id',
            name: 'Test User',
            email: 'test@example.com'
        };
        next();
    }
};

// ============================================
// РОУТЫ API
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);
app.use('/api/content', authMiddleware, contentRoutes);
app.use('/api/monetization', authMiddleware, monetizationRoutes);
app.use('/api/audience', authMiddleware, audienceRoutes);
app.use('/api/communications', authMiddleware, communicationsRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/finance', authMiddleware, financeRoutes);

// ============================================
// ГЛАВНАЯ СТРАНИЦА
// ============================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// ОБРАБОТКА 404
// ============================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Маршрут не найден'
    });
});

// ============================================
// ОБРАБОТКА ОШИБОК
// ============================================

app.use((err, req, res, next) => {
    console.error('❌ Ошибка:', err.stack);
    
    // Ошибки multer
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'Файл слишком большой!'
        });
    }
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Внутренняя ошибка сервера'
    });
});

// ============================================
// ЗАПУСК СЕРВЕРА
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
    console.log(`📊 Creator Dashboard API готов к работе`);
    console.log(`📹 Видео будут сохраняться в: ${videoDir}`);
    console.log(`🖼️ Изображения будут сохраняться в: ${imageDir}`);
    console.log(`🔗 API доступен по адресу: http://localhost:${PORT}/api`);
    console.log(`🌍 Режим: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;