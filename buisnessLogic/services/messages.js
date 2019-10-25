const messagesModel = require('../../database/models/messages');

module.exports = {
    create: async function(content) {
        return await messagesModel.create({ 
            //
        });
    },

    delete: async function(id){
        return await messagesModel.deleteOne({ _id: id })
    },

    findByChatId: async function(id){
        return await messagesModel.deleteOne({ _id: id })
    },
} 