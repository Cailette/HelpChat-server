const userModel = require('../app/api/models/users');
const visitorModel = require('../app/api/models/visitors');
const messageModel = require('../app/api/models/messages');
const chatModel = require('../app/api/models/chats');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log("CONNECTION: " + socket);

    socket
      .on('locationChange', locationChange)
      .on('joinRoom', joinRoom)
      .on('disconnect', disconnect);

    function locationChange(location, callback) {
      console.log("LOCATION: " + location)
      io.in(socket.room).emit('locationChange', location);
    }

    function joinRoom(room, callback) {
      console.log("joinRoom: " + room)
      socket.room = room;
      socket.join(room);
      console.log("socket.room: " + socket.room)
      io.in(socket.room).emit('locationChange', "New visitor");
    }

    function disconnect() {
      console.log('DISCONNECT');
    }
  });
}