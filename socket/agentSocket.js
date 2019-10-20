const userService = require('../buisnessLogic/services/users');
const visitorService = require('../buisnessLogic/services/visitors');
const chatService = require('../buisnessLogic/services/chats');
const jwt = require('jsonwebtoken');

module.exports = (io, visitorSocket) => {
    io.on('connection', (socket) => {
        const token = socket.handshake.query.token;
        jwt.verify(token, 'HelpChatRestApi', (err, decoded) => {
        socket.id = decoded.id;
          socket.representative = decoded.representative;
        });

        socket.join(socket.id);
        socket.room = socket.id;
        console.log("AGENT CONNECTION: " + socket.room);

        socket
            .on('switchRoom', switchRoom)
            .on('disconnect', disconnect)
            .on('getLocation', getLocation);

        function switchRoom(room) {
            socket.room = room;
            socket.join(room);
            console.log("switchRoom socket.room: " + socket.room)
        }

        function getLocation(){
            console.log("getLocation agent " + socket.room)
            visitorSocket.in(socket.room).emit('getLocation');
        }

        function disconnect() {
            // + notify visitors
            console.log('DISCONNECT');
        }
    });
}