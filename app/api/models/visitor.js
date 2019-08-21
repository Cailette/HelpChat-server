const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VisitorSchema = new Schema({
    visitCount: {
        type: Number,
        trim: true,  
        default: 1
    },
    lastVisit: {
        type: Date,
        trim: true,  
        default: Date.now
    }
});

module.exports = mongoose.model('Visitor', VisitorSchema);