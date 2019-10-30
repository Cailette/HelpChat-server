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

WorkHoursSchema.post('save', async function(){
    const User = require('./user');
    const user = await User.findById(this.user);
    if(user.workHours.indexOf(user._id) === -1){
        user.workHours.push(this._id);
        user.save((err) => {
            console.log(err)
        });
    }
});

module.exports = mongoose.model('WorkHours', WorkHoursSchema);