const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    visitor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'Visitor'
    },
    agent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'User'
    },
    rating: {
        type: Number,
        trim: true,
        default: null
    },
    date: {
        type: Date,
        trim: true,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        trim: true,
        default: true
    },
    messages: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat'
    }]
});

ChatSchema.post('save', async function(){
    const Visitor = require('./visitors');
    const User = require('./user');

    const visitor = await Visitor.findById(this.visitor);
    if(visitor.chats.indexOf(visitor._id) === -1){
        visitor.chats.push(this._id);
        visitor.save((err) => {
            console.log(err)
        });
    }
    const user = await User.findById(this.user);
    if(user.chats.indexOf(user._id) === -1){
        user.chats.push(this._id);
        user.save((err) => {
            console.log(err)
        });
    }
});

module.exports = mongoose.model('Chat', ChatSchema);