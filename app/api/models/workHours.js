const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkHoursSchema = new Schema({
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
    dayOfWeek: {
        type: Number,
        trim: true,
        required: true
    },
    dayFrom: {
        type: Date,
        trim: true,
        required: true,
        default: Date.now
    },
    dayTo: {
        type: Date,
        trim: true,
        default: null
    }
});

module.exports = mongoose.model('WorkHours', WorkHoursSchema);