const userService = require('../buisnessLogic/services/users');
const visitorService = require('../buisnessLogic/services/visitors');
const chatService = require('../buisnessLogic/services/chats');
const messagesService = require('../buisnessLogic/services/messages');
const jwt = require('jsonwebtoken');

module.exports = (io, agentSocket) => {
    io.on('connection', (socket) => {
        const token = socket.handshake.query.token;
        jwt.verify(token, 'HelpChatRestApi', (err, decoded) => {
            socket.id = decoded.id;
            socket.representative = decoded.representative;
        });

        socket.join(socket.id);
        socket.room = socket.id;
        socket.username = "VISITOR"; 
        console.log("VISITOR CONNECTION: " + socket.room);

        socket
            .on('connectWithAgent', connectWithAgent)
            .on('locationChange', locationChange)
            .on('disconnect', disconnect);

        function locationChange(location) {
            console.log("location visitor " + socket.room + " " + location + " " + Boolean(agentSocket))
            // agentSocket.in(socket.room).emit('locationChange', location);
        }

        async function connectWithAgent() {
            let checkIfExistChat = await chatService.findActiveByVisitorId(socket.id);
            console.log(!!checkIfExistChat)
            console.log(JSON.stringify(checkIfExistChat))
            if(!checkIfExistChat) {
                firstChat();
            } else {
                nextChat(checkIfExistChat);
            }
        }

        async function disconnect() {
            if(!socket.nextChat) {
                console.log("Disconnect: " + socket.chat);
                let chat = await chatService.findById(socket.chat);
                if(!chat){
                    console.log("Disconnect ERROR in: " + socket.chat);
                }
                let updatedChat = chatService.updateActivity(chat)
                if(!updatedChat){
                    console.log("Disconnect ERROR in: " + socket.chat);
                }
                // powiadom agenta
                // agentSocket.in(socket.agent).emit('updateChatList');
            }
            socket.leave(socket.room);
        }

        async function firstChat(){
            socket.nextChat = false;
            let agent = await userService.findRandomWorkingUserByRepresentative(socket.representative);
            if(!agent){
                io.in(socket.room).emit('connectionWithAgent', null);
            }
            socket.agent = agent._id;
            console.log("connectionWithAgent: " + socket.agent);

            let newChat = await chatService.create(socket.room, agent._id)
            if(!newChat){
                io.in(socket.room).emit('error', "Can not create chat.");
            }
            socket.chat = newChat._id;
            console.log("newChat: " + socket.chat);
            
            io.emit('connectionWithAgent', agent);

            // powiadom agenta
            // agentSocket.in(socket.agent).emit('updateChatList');
            // agentSocket.in(socket.agent).emit('newChat');
        }

        async function nextChat(chat){
            socket.nextChat = true; 
            socket.agent = chat.agent;
            socket.chat = chat._id;

            let agent = await userService.findById(chat.agent);
            let messages = await messagesService.findByChatId(chat._id);

            io.emit('nextChat', messages, agent); 
        }
    });
}