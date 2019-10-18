const userService = require('../buisnessLogic/services/users');
const visitorService = require('../buisnessLogic/services/visitors');
const chatService = require('../buisnessLogic/services/chats');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
    io.on('connection', (socket) => {
        const token = socket.handshake.query.token;
        jwt.verify(token, 'HelpChatRestApi', (err, decoded) => {
          socket.room = decoded.id;
          socket.representative = decoded.representative;
        });

        socket.join(socket.room);
        console.log("VISITOR CONNECTION: " + socket.room);

        socket
        .on('connectWithAgent', connectWithAgent)
        .on('locationChange', locationChange)
        .on('disconnect', disconnect);

        function locationChange(location) {
            io.in(socket.room).emit('locationChange', location);
        }

        async function connectWithAgent() {
            let agent = await userService.findRandomWorkingUserByRepresentative(socket.representative);
            if(!agent){
                io.in(socket.room).emit('connectionWithAgent', null);
            }
            socket.agent = agent._id;
            console.log("agent: " + agent);

            let newChat = await chatService.create(socket.room, agent._id)
            if(!newChat){
                io.in(socket.room).emit('error', "Can not create chat.");
            }

            socket.chat = newChat._id;
            console.log("newChat: " + newChat);
            io.in(socket.room).emit('connectionWithAgent', agent);
            // + powiadom agenta
        }

        async function disconnect() {
            // + powiadom agenta
            console.log("Disconnect: " + socket.chat);
            let chat = await chatService.findById(socket.chat);
            if(!chat){
                console.log("Disconnect ERROR in: " + socket.chat);
            }
            let updatedChat = chatService.updateActivity(chat)
        }
    });
}