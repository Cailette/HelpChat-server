const userService = require('../buisnessLogic/services/users');
const visitorService = require('../buisnessLogic/services/visitors');
const chatService = require('../buisnessLogic/services/chats');
const jwt = require('jsonwebtoken');

module.exports = (agentSocket, visitorSocket) => {
    agentSocket.on('connection', (socket) => {
        socket
            .on('init', init)
            .on('switchRoom', switchRoom)
            .on('disconnect', disconnect)
            .on('getLocation', getLocation);

        
        function init(token){
            // const token = socket.handshake.query.token;
            jwt.verify(token, 'HelpChatRestApi', (err, decoded) => {
                socket.id = decoded.id;
                socket.representative = decoded.representative;
            });
    
            socket.room = socket.id;
            socket.join(socket.room);
            console.log("AGENT CONNECTION: " + socket.room);
        }

        function switchRoom(room) {
            socket.leave(socket.room);
            socket.room = room;
            socket.join(room);
            console.log("switchRoom socket.room: " + socket.room)
        }

        function getLocation(){
            console.log("getLocation agent " + socket.room)
            visitorSocket.in(socket.room).emit('getLocation');
            // io.sockets.in(socket.room).emit('getLocation');
        }

        function disconnect() {
            // + notify visitors
            console.log('DISCONNECT');
            socket.leave(socket.room);
        }
    });
}