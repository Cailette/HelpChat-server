const userService = require('../buisnessLogic/services/users');
const chatService = require('../buisnessLogic/services/chats');
const messagesService = require('../buisnessLogic/services/messages');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket
            .on('init', init)
            .on('connectWithAgent', connectWithAgent)
            .on('locationChange', locationChange)
            .on('switchRoom', switchRoom)
            .on('disconnect', disconnect)
            .on('getLocation', getLocation)
            .on('closeChat', agentCloseChat)
            .on('message', message);

        function init(token, user){
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                socket.userId = decoded.id;
                socket.representative = decoded.representative;
            });

            socket.user = user;
            socket.room = null;

            if(user === "agent") {
                socket.agentRoom = socket.userId;
                socket.join(socket.agentRoom);
            }
        }

        function locationChange(location) {
            socket.to(socket.room).emit('locationChange', location);
        }

        function getLocation(){
            socket.to(socket.room).emit('getLocation');
        }

        async function connectWithAgent(agentId) {
            if(agentId !== null) {
                firstChat(agentId);
            } else {
                let existChat = await chatService.findActiveByVisitorId(socket.userId);
                nextChat(existChat);
            }
        }

        async function firstChat(agentId){
            socket.nextChat = false;
            socket.agent = agentId;

            let newChat = await chatService.create(socket.userId, socket.agent)
            if(!newChat){
                socket.emit('error', "Can not create chat.");
            }
            socket.room = newChat._id;
            socket.join(socket.room);

            let thisChat = await chatService.findActiveByVisitorId(socket.userId);

            socket.emit('connectionWithAgent', await chatService.findActiveByVisitorId(socket.userId));

            socket.to(socket.agent).emit('newChat');
            socket.to(socket.agent).emit('updateChatList', thisChat);
        }

        async function nextChat(chat){
            socket.nextChat = true; 
            socket.agent = chat.agent._id;
            socket.room = chat._id;

            socket.join(socket.room);
            socket.emit('nextChat', chat);
        }

        async function message(content){
            const message = await messagesService.create(socket.room, content, socket.user);

            socket.emit('message', message);
            socket.to(socket.room).emit('message', message);

            if(socket.user === 'visitor'){
                socket.to(socket.agent).emit('message', message);
                socket.to(socket.agent).emit('newChat');
            }
        }

        function switchRoom(room) {
            socket.leave(socket.room);
            socket.room = null;

            if(room !== socket.userId) {
                socket.room = room;
                socket.join(room);
            }
        }

        async function disconnect() {
            if(socket.user === "visitor") await disconnectVisitor();
            if(socket.user === "agent") await disconnectAgent();
        }

        async function disconnectVisitor(){
            if(!socket.nextChat) {
                let chat = await chatService.findById(socket.room);
                if(!chat){
                    console.log("DISCONNECT ERROR in: " + socket.room);
                }
                let updatedChat = chatService.updateActivityFalse(chat)
                if(!updatedChat){
                    console.log("DISCONNECT ERROR in: " + socket.room);
                }
                socket.to(socket.agent).emit('visitorDisconnect', socket.room);
            }
            socket.leave(socket.room);
            socket.room = null;
        }

        async function disconnectAgent(){
            if(!socket.nextChat) {
                if(socket.room !== null){
                    socket.to(socket.room).emit('agentDisconnect');
                    socket.leave(socket.room);
                }
            }
            socket.leave(socket.userId);
        }

        async function agentCloseChat() {
            let chat = await chatService.findById(socket.room);
            if(!chat){
                socket.emit('error', "Can not found chat.");
            }

            let updatedChat = chatService.updateActivityFalse(chat)
            if(!updatedChat){
                socket.emit('error', "Can not update chat.");
            }

            socket.to(socket.room).emit('agentDisconnect');
            socket.leave(socket.room);
        }
    });
}