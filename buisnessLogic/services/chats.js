const chatModel = require('../../database/models/chats');

module.exports = {
    create: async function(visitor, agent) {
        return await chatModel.create({ 
            visitor: visitor,
            agent: agent
        });
    },

    findActiveByUserId: async function(id) {
        return await chatModel.find({ agent: id, isActive: true })
        .populate('agent')
        .populate('visitor')
        .populate('messages')
    },

    findInactiveByUserId: async function(id) {
        return await chatModel.find({ isActive: false })
            .populate({
                path: 'agent',
                match: { _id: id},
                select: '_id firstname lastname email'
            })
            .populate('visitor')
            .populate('messages')
    },

    findInactiveByRepresentative: async function(id) {
        return await chatModel.find({ isActive: false })
            .populate({
                path: 'agent',
                match: { $or: [{_id: id}, {representative: id}] },
                select: '_id firstname lastname email'
            })
            .populate('visitor')
            .populate('messages')
    },

    findActiveByVisitorId: async function(id) {
        if(JSON.stringify(await chatModel.find()) === "[]"){
            return false;
        } else {
            return await chatModel.findOne({ visitor: id, isActive: true })
        }
    },

    findById: async function(id) {
        return await chatModel.findById(id)
    },

    updateRating: async function(chat, rating){
        if(chat.constructor.modelName !== 'Chat') {
            return;
        }
        chat.rating = rating; 
        return await chat.save();
    },

    delete: async function(id){
        return await chatModel.deleteOne({ _id: id })
    },

    updateActivity: async function(chat){
        if(chat.constructor.modelName !== 'Chat') {
            return;
        }
        chat.isActive = false; 
        return await chat.save();
    },
} 