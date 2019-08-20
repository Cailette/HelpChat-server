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
    hourFrom: {
        type: Number,
        trim: true,  
        required: true,
    },
    hourTo: {
        type: Number,
        trim: true,  
        required: true,
    },
    day: {
        type: Date,
        trim: true,
        required: true
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);