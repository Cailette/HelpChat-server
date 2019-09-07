const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'Chat'
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    date: {
        type: Date,
        trim: true,
        default: Date.now
    },
    sender: {
        type: String,
        trim: true,
        required: true,
        enum: ['visitor', 'agent']
    }
});

module.exports = mongoose.model('Message', MessageSchema);