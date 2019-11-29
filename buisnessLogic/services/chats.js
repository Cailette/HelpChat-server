const chatModel = require('../../database/models/chats');
var Joi = require('joi');

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
        .populate({ 
            path: 'messages', 
            options: { 
                sort: { date: -1 } 
            } 
        })
    },

    findInactiveByRepresentative: async function(id) {
        return await chatModel.find({ isActive: false })
            .populate({
                path: 'agent',
                match: { $or: [{_id: id}, {representative: id}] },
                select: '_id firstname lastname email'
            })
            .populate('visitor')
            .populate({ 
                path: 'messages', 
                options: { 
                    sort: { date: -1 } 
                } 
            })
            .sort({date: 1})
    },

    findActiveByVisitorId: async function(id) {
        if(JSON.stringify(await chatModel.find()) === "[]"){
            return false;
        } else {
            return await chatModel.findOne({ visitor: id, isActive: true })
                .populate({
                    path: 'agent',
                    select: '_id firstname lastname email'
                })
                .populate('visitor')
                .populate({ 
                    path: 'messages', 
                    options: { 
                        sort: { date: -1 } 
                    } 
                })
        }
    },

    disactiveChat: async function(visitorId){
        let chat = await this.findActiveByVisitorId(visitorId);
        if(!chat){
            return;
        }
        let updatedChat = await this.updateActivityFalse(chat)
        if(!updatedChat){
            return;
        }
        return updatedChat;
    },

    findActive: async function(id) {
        if(JSON.stringify(await chatModel.find()) === "[]"){
            return false;
        } else {
            return await chatModel.find({ isActive: true })
        }
    },

    findById: async function(id) {
        return await chatModel.findById(id)
            .populate({
                path: 'agent',
                select: '_id firstname lastname email'
            })
            .populate('visitor')
            .populate({ 
                path: 'messages', 
                options: { 
                    sort: { date: -1 } 
                } 
            })
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

    updateActivityFalse: async function(chat){
        if(chat.constructor.modelName !== 'Chat') {
            return;
        }
        chat.isActive = false; 
        return await chat.save();
    },

    chatValidate: function(chat) {
        var schema = {
            visitor: Joi.any().not(null).required(),
            agent: Joi.any().not(null).required(),
        }
        return Joi.validate(chat, schema);
    },

    ratingValidate: function(rating) {
        var schema = {
            rating: Joi.number().min(1).max(5).required(),
        }
        return Joi.validate(rating, schema);
    }
} 