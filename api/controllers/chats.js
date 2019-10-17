const chatService = require('../../buisnessLogic/services/chats');

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
    }
}