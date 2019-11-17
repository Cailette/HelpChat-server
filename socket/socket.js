const userService = require('../buisnessLogic/services/users');
const chatService = require('../buisnessLogic/services/chats');
const messagesService = require('../buisnessLogic/services/messages');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("SOCKET CONNECTION");

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
            jwt.verify(token, 'HelpChatRestApi', (err, decoded) => {
                socket.clientId = decoded.id;
                socket.representative = decoded.representative;
            });

            socket.user = user;

            if(user === "visitor") {
                socket.room = null;
            }

            if(user === "agent") {
                socket.agentRoom = socket.clientId;
                socket.room = null;
                socket.join(socket.clientId);
            }

            console.log("CONNECTION: " + socket.user);
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
                let checkIfExistChat = await chatService.findActiveByVisitorId(socket.clientId);
                nextChat(checkIfExistChat);
            }
        }

        async function firstChat(agentId){
            socket.nextChat = false;
            socket.agent = agentId;

            let newChat = await chatService.create(socket.clientId, socket.agent)
            if(!newChat){
                socket.emit('error', "Can not create chat.");
            }
            socket.room = newChat._id;
            socket.join(socket.room);
            console.log("newChat: " + socket.room);

            let thisChat = await chatService.findActiveByVisitorId(socket.clientId);
            socket.emit('connectionWithAgent', await chatService.findActiveByVisitorId(socket.clientId));
            socket.to(socket.agent).emit('newChat');
            socket.to(socket.agent).emit('updateChatList', thisChat);
        }

        async function nextChat(chat){
            console.log("nextChat");
            socket.nextChat = true; 
            socket.agent = chat.agent._id;
            socket.room = chat._id;
            socket.join(socket.room);

            socket.emit('nextChat', chat);
        }

        async function message(content){
            const message = await messagesService.create(socket.room, content, socket.user);

            socket.emit('message', message);
            if(socket.user === 'agent'){
                console.log("to visitor " + content);
                socket.broadcast.to(socket.room).emit('message', message);
            }
            if(socket.user === 'visitor'){
                console.log("to agent " + content);
                socket.broadcast.to(socket.room).emit('message', message);
                socket.broadcast.to(socket.agent).emit('message', message);
            }
        }

        function switchRoom(room) {
            socket.leave(socket.room);
            socket.room = null;
            if(room !== socket.clientId) {
                socket.room = room;
                socket.join(room);
                console.log("join " + socket.room)
            }
            console.log("I am in: " + socket.room)
        }

        async function disconnect() {
            if(socket.user === "visitor"){
                if(!socket.nextChat) {
                    console.log("DISCONNECT VISITOR: " + socket.room);
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

            if(socket.user === "agent"){
                if(!socket.nextChat) {
                    console.log('DISCONNECT AGENT');
                    if(socket.room !== null){
                        socket.to(socket.room).emit('agentDisconnect');
                        socket.leave(socket.room);
                    }
                }
                socket.leave(socket.clientId);
            }
        }

        async function agentCloseChat() {
            console.log('agentCloseChat');
            let chat = await chatService.findById(socket.room);
            if(!chat){
                console.log("DISCONNECT ERROR in: " + socket.room);
            }
            let updatedChat = chatService.updateActivityFalse(chat)
            if(!updatedChat){
                console.log("DISCONNECT ERROR in: " + socket.room);
            }
            socket.to(socket.room).emit('agentDisconnect');
            socket.leave(socket.room);
        }
    });
}