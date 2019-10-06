const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        ref: 'Chat'
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
    date: {
        type: Date,
        trim: true,
        default: Date.now
    },
    sender: {
        type: String,
        trim: true,
        required: true,
        enum: ['visitor', 'agent']
    }
});

MessageSchema.post('save', async function(){
    const Chat = require('./chats');

    const chat = await Chat.findById(this.chat);
    if(chat.messages.indexOf(chat._id) === -1){
        chat.messages.push(this._id);
        chat.save((err) => {
            console.log(err)
        });
    }
});

module.exports = mongoose.model('Message', MessageSchema);