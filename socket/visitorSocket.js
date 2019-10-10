const userService = require('../buisnessLogic/services/users');
const visitorService = require('../buisnessLogic/services/visitors');
const chatService = require('../buisnessLogic/services/chat');

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.join(socket.id);
        console.log("CONNECTION: " + socket.id);

        socket
        .on('connectWithAgent', connectWithAgent)
        .on('locationChange', locationChange)
        .on('disconnect', disconnect);

        function locationChange(location) {
            console.log("LOCATION: " + location)
            io.in(socket.room).emit('locationChange', location);
        }

        async function connectWithAgent() {
            let agent = userService.findRandomWorkingUserByRepresentative(socket.representative);
            if(!agent){
                io.in(socket.room).emit('connectionWithAgent', null);
            }

            let newChat = chatService.create(socket.id, agent._id)
            if(!newChat){
                io.in(socket.room).emit('error', "Can not create chat.");
            }

            socket.chat = newChat._id;
            io.in(socket.room).emit('connectionWithAgent', null);

            // socket.location = room;
            // socket.join(room);
            // console.log("socket.room: " + socket.location)
            // io.in(socket.location).emit('locationChange', "New visitor");
        }

        function disconnect() {
            let updatedChat = chatService.updateActivity(socket.chat)
        }
    });
}