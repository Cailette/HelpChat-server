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
    isActive: {
        type: Boolean,
        trim: true,
        default: true
    },
    representative: {
        type: mongoose.Schema.Types.ObjectId, 
        trim: true,
        required: true,
        ref: 'User'
    },
    chats: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat'
    }]
});

VisitorSchema.post('save', async function(){
    const User = require('./users');
    const user = await User.findById(this.representative);
    if(user.visitors.indexOf(this._id) === -1){
        user.visitors.push(this._id);
        user.save((err) => {
            console.log(err)
        });
    }
});

module.exports = mongoose.model('Visitor', VisitorSchema);