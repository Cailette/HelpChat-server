const messagesModel = require('../../database/models/messages');
var Joi = require('joi');

module.exports = {
    create: async function(chat, content, sender) {
        return await messagesModel.create({ 
            chat: chat,
            content: content,
            sender: sender
        });
    },

    messageValidate: function(message) {
        var schema = {
            content: Joi.string().not(null).min(1).max(1000).required(),
            sender: Joi.any().valid(['visitor', 'agent']),
        }
        return Joi.validate(message, schema);
    }
}