const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        enum: ['article', 'video', 'audio', 'gallery', 'podcast', 'collection'],
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    tags: {
        type: [String],
        default: [],
    },
    access: {
        type: String,
        enum: ['free', 'subscription', 'paid'],
        default: 'free',
    },
    price: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'scheduled'],
        default: 'draft',
    },
    views: {
        type: Number,
        default: 0,
    },
    reactions: {
        type: Number,
        default: 0,
    },
    revenue: {
        type: Number,
        default: 0,
    },
    // Видео
    videoUrl: {
        type: String,
        default: null,
    },
    videoFile: {
        filename: { type: String, default: null },
        originalName: { type: String, default: null },
        path: { type: String, default: null },
        size: { type: Number, default: 0 },
        mimetype: { type: String, default: null },
    },
    // Изображения
    images: [{
        filename: { type: String },
        originalName: { type: String },
        path: { type: String },
        size: { type: Number },
        mimetype: { type: String },
    }],
    coverImage: {
        type: String,
        default: null,
    },
    // Автор
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    scheduledFor: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Content', ContentSchema);