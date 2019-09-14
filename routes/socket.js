const userModel = require('../app/api/models/users');
const visitorModel = require('../app/api/models/visitors');
const messageModel = require('../app/api/models/messages');
const chatModel = require('../app/api/models/chats');


module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(socket.sender + ' CONNECTED');
    socket.join(socket.representative);

    socket
      .on('locationChange', locationChange)
      .on('disconnect', disconnect);

    function locationChange(location, callback) {
      console.log("LOCATION: " + location)
    }

    function disconnect() {
      console.log('DISCONNECT');
    }
  });
}