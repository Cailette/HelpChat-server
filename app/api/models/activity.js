const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        default: null,
        ref: 'User'
    },
    from: {
        type: Date,
        trim: true,  
        required: true,
    },
    to: {
        type: Date,
        trim: true,
        default: null
    },
    inTime: {
        type: Boolean,
        trim: true,
        default: true
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);