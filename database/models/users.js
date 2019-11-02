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
    },
    chats: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat'
    }],
    activities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity'
    }],
    workHours: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WorkHours'
    }]
});

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    if(this.password){
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();
});

UserSchema.pre('remove', function() {
    const Chats = require('./chats');
    Chats.remove({_id: { $in: this.chats }}, (err, res) => {
        console.log(err)
    })
    const Activities = require('./activities');
    Activities.remove({_id: { $in: this.activities }}, (err, res) => {
        console.log(err)
    })
    const WorkHours = require('./workHours');
    WorkHours.remove({_id: { $in: this.workHours }}, (err, res) => {
        console.log(err)
    })
    if(this.representative === null){
        const Users = require('./user');
        Users.remove({representative: this._id }, (err, res) => {
            console.log(err)
        })
    }
});

module.exports = mongoose.model('User', UserSchema);