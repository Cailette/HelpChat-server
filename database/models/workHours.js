const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WorkHoursSchema = new Schema({
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
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
    const User = require('./users');
    const user = await User.findById(this.agent);
    if(user.workHours.indexOf(this._id) === -1){
        user.workHours.push(this._id);
        user.save((err) => {
            console.log(err)
        });
    }
});

module.exports = mongoose.model('WorkHours', WorkHoursSchema);