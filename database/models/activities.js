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

ActivitySchema.post('save', async function(){
    const User = require('./user');
    const user = await User.findById(this.user);
    if(user.activities.indexOf(user._id) === -1){
        user.activities.push(this._id);
        user.save((err) => {
            console.log(err)
        });
    }
});

module.exports = mongoose.model('Activity', ActivitySchema);