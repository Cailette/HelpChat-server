const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'Visitor'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        trim: true,
        default: null
    },
    date: {
        type: Date,
        trim: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        trim: true,
        default: true
    }
});

module.exports = mongoose.model('Chat', ChatSchema);