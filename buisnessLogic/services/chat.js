const chatModel = require('../../database/models/chats');

module.exports = {
    create: async function(visitor, agent) {
        return await chatModel.create({ 
            visitor: visitor,
            agent: agent
        });
    },

    findById: async function(id) {
        return await chatModel.findById(id)
    },

    updateActivity: async function(chat){
        if(chat.constructor.modelName !== 'Chat') {
            return;
        }
        chat.isActive = false; 
        return await chat.save();
    },

    delete: async function(id){
        return await chatModel.deleteOne({ _id: id })
    },
}