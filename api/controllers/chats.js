const chatService = require('../../buisnessLogic/services/chats');

module.exports = {
    getById: async function(req, res) {
        const chat = await chatService.findById(req.params.ChatId)

        if(!chat) {
            return res.status(404).json({
                message: "Chat not found!"
            });
        }

        return res.status(200).json({
            message: "Chat found successfully!", 
            chat: chat
        });
    },

    getActiveByAgentId: async function(req, res) {
        const chats = await chatService.findActiveByUserId(
            req.body.representative == null? req.body.id: req.body.representative);
            
        if(!chats) {
            return res.status(404).json({
                message: "Chats not found!"
            });
        }

        return res.status(200).json({
            message: "Chats found successfully!", 
            chats: chats
        });
    },

    getInactive: async function(req, res) {
        let chats = await chatService.findInactiveByRepresentative(
            req.body.representative ? req.body.representative : req.body.id);

        if(!chats) {
            return res.status(404).json({
                message: "Chats not found!"
            });
        }

        return res.status(200).json({
            message: "Chats found successfully!", 
            chats: chats
        });
    },
    
    getVisitorAgent: async function(req, res) {
        let chat = await chatService.findActiveByVisitorId(
            req.params.VisitorId ? req.params.VisitorId : req.body.id);

        return res.status(200).json({
            message: chat? "Chat found successfully!" : "Active chat not exist!", 
            user: chat? chat.agent : null
        });
    },

    delete: async function(req, res){
        const chatDeleted = await chatService.delete(req.params.ChatId)

        if(!chatDeleted) {
            return res.status(400).json({
                message: "Chat can not be deleted!"
            });
        }

        return res.status(200).json({
            message: "Chat deleted successfully!"
        });
    },

    rating: async function(req, res) {
        const chat = await chatService.findById(req.params.ChatId);
            
        if(!chat) {
            return res.status(404).json({
                message: "Chat not found!"
            });
        }

        const ratedChat = await chatService.updateRating(chat, req.body.rating);
            
        if(!ratedChat) {
            return res.status(400).json({
                message: "Chat can not be rated!"
            });
        }

        return res.status(200).json({
            message: "Chat updated successfully!", 
            chat: ratedChat
        });
    },
}