const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VisitorSchema = new Schema({
    lastVisit: {
        type: Date,
        trim: true,  
        default: Date.now
    },
    geoLocation: {
        lat: {
            type: String,
            trim: true,  
            default: "Brak danych"
        }, 
        lng: {
            type: String,
            trim: true,  
            default: "Brak danych"
        }
    },
    browserSoftware: {
        type: String,
        trim: true,  
        default: "Brak danych"
    },
    operatingSoftware: {
        type: String,
        trim: true,  
        default: "Brak danych"
    },
});

module.exports = mongoose.model('Visitor', VisitorSchema);