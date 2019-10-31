const messagesModel = require('../../database/models/messages');

module.exports = {
    create: async function(chat, content, sender) {
        return await messagesModel.create({ 
            chat: chat,
            content: content,
            sender: sender
        });
    },
}