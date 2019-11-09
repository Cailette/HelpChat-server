const userService = require('../buisnessLogic/services/users');
const visitorService = require('../buisnessLogic/services/visitors');
const chatService = require('../buisnessLogic/services/chats');
const messagesService = require('../buisnessLogic/services/messages');
const jwt = require('jsonwebtoken');

module.exports = (agentSocket, visitorSocket, io) => {
    agentSocket.on('connection', (socket) => {
        socket
            .on('init', init)
            .on('switchRoom', switchRoom)
            .on('disconnect', disconnect)
            .on('getLocation', getLocation)
            .on('message', message);

        
        function init(token){
            // const token = socket.handshake.query.token;
            jwt.verify(token, 'HelpChatRestApi', (err, decoded) => {
                socket.id = decoded.id;
                socket.representative = decoded.representative;
            });
            socket.room = null;
            socket.join(socket.id);
            console.log("AGENT CONNECTION: " + socket.id);
        }

        function switchRoom(room) {
            socket.leave(socket.room);
            socket.room = null;
            if(room !== socket.id) {
                socket.room = room;
                socket.join(room);
            }
            console.log("switchRoom socket.room: " + socket.room)
        }

        function getLocation(){
            console.log("getLocation agent " + socket.room)
            console.log(agentSocket.sockets.adapter);
            io.of('/visitor').in(socket.room).emit('getLocation');
            // io.sockets.in(socket.room).emit('getLocation');
        }

        async function message(content){
            const message = await messagesService.create(socket.room, content, "agent");

            socket.emit('message', message);
            // agent
            // visitorSocket.emit('message', message);
        }

        function disconnect() {
            console.log('DISCONNECT');
            if(socket.room !== null){
                socket.leave(socket.room);
                // + notify visitors
            }
            socket.leave(socket.id);
        }
    });
}