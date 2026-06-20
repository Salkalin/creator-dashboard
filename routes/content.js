const express = require('express');
const router = express.Router();
const Content = require('../models/Content');

// Получение всего контента (с фильтрацией)
router.get('/', async (req, res) => {
    try {
        const { type, status } = req.query;
        const filter = {};
        
        if (type && type !== 'all') filter.type = type;
        if (status && status !== 'all') filter.status = status;
        
        const content = await Content.find(filter)
            .sort({ createdAt: -1 })
            .populate('authorId', 'name email');
        
        res.json({
            success: true,
            data: content
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Получение конкретного материала
router.get('/:id', async (req, res) => {
    try {
        const content = await Content.findById(req.params.id)
            .populate('authorId', 'name email');
        
        if (!content) {
            return res.status(404).json({ success: false, message: 'Материал не найден' });
        }
        
        res.json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Создание нового материала
router.post('/', async (req, res) => {
    try {
        const {
            title,
            type,
            description,
            tags,
            access,
            price,
            status,
            scheduledFor,
            videoUrl,
            videoFile,
            images,
            coverImage
        } = req.body;
        
        const newContent = new Content({
            title,
            type,
            description: description || '',
            tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : [],
            access: access || 'free',
            price: price || 0,
            status: status || 'draft',
            authorId: req.user._id,
            scheduledFor: scheduledFor || null,
            videoUrl: videoUrl || null,
            videoFile: videoFile || null,
            images: images || [],
            coverImage: coverImage || null,
            views: 0,
            reactions: 0,
            revenue: 0
        });
        
        await newContent.save();
        
        res.status(201).json({
            success: true,
            data: newContent,
            message: 'Материал создан успешно'
        });
    } catch (error) {
        console.error('❌ Ошибка создания контента:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Обновление материала
router.put('/:id', async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Материал не найден' });
        }
        
        const updatedContent = await Content.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            data: updatedContent,
            message: 'Материал обновлён'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Удаление материала
router.delete('/:id', async (req, res) => {
    try {
        const content = await Content.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ success: false, message: 'Материал не найден' });
        }
        
        await content.deleteOne();
        
        res.json({
            success: true,
            message: 'Материал удалён'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Получение типов контента для статистики
router.get('/types/stats', async (req, res) => {
    try {
        const stats = await Content.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const result = {};
        stats.forEach(s => { result[s._id] = s.count; });
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;