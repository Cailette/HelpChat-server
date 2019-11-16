const chatService = require('../../buisnessLogic/services/chats');
const MessageService = require('../../buisnessLogic/services/messages')

module.exports = {
    updateById: async function(req, res) {
        const chat = await chatService.findById(req.params.ChatId)

        if(!chat) {
            return res.status(404).json({
                message: "Chat not found!"
            });
        }

        const updatedChat = await chatService.update(chat) // i jakieś parametry np ocena

        if (!updatedChat) {
            return res.status(401).json({
                message: "Chat can not be updated!"
            });
        }

        return res.status(200).json({
            status: 200, 
            message: "Chat updated successfully!", 
            chat: updatedChat
        });
    },

    getById: async function(req, res) {
        const chat = await chatService.findById(req.params.ChatId)

        if(!chat) {
            return res.status(404).json({
                message: "Chat not found!"
            });
        }

        return res.status(200).json({
            status: 200, 
            message: "Chat updated successfully!", 
            chat: chat
        });
    },

    getActiveByAgentId: async function(req, res) {
        const chats = await chatService.findActiveByUserId(req.body.representative == null? req.body.id: req.body.representative);
            
        if(!chats) {
            return res.status(404).json({
                message: "Chats not found!"
            });
        }

        return res.status(200).json({
            status: 200, 
            message: "Chats found successfully!", 
            chats: chats
        });
    },

    getInactive: async function(req, res) {
        let chats = await chatService.findInactiveByRepresentative(req.body.representative ? req.body.representative : req.body.id);

        if(!chats) {
            return res.status(404).json({
                message: "Chats not found!"
            });
        }

        return res.status(200).json({
            status: 200, 
            message: "Chats found successfully!", 
            chats: chats
        });
    },

    getAgentByVisitorId: async function(req, res) {
        let chat = await chatService.findActiveByVisitorId(req.params.VisitorId);

        return res.status(200).json({
            status: 200, 
            message: "Chats found successfully!", 
            agent: chat? chat.agent : null
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
            status: 200, 
            message: "Chat updated successfully!", 
            chat: ratedChat
        });
    },

    // messages: async function(req, res) {
        
    //     const m1 = await MessageService.create("5db94c43b2972e4040978092", 
    //     "Lorem 1 ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit. Excepteur sint occaecat cupidatat non proident.", 
    //     "agent");
    //     const m4 = await MessageService.create("5db94c43b2972e4040978092", 
    //     "Lorem 2 ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", 
    //     "agent");
    //     const m5 = await MessageService.create("5db94c43b2972e4040978092", 
    //     "Ut 3 enim ad minim Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat?", 
    //     "visitor");

    //     return res.status(200).json({
    //         status: 200, 
    //         message: "Chat updated successfully!"
    //     });
    // }
}