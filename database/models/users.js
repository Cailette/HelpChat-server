const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        trim: true,  
        required: true,
    },
    lastname: {
        type: String,
        trim: true,  
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    isActive: {
        type: Boolean,
        trim: true,
        default: false
    },
    representative: {
        type: mongoose.Schema.Types.ObjectId, 
        trim: true,
        default: null,
        ref: 'User'
    }
});

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    if(this.password){
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);