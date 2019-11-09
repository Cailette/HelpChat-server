const userService = require('../buisnessLogic/services/users');
const chatService = require('../buisnessLogic/services/chats');
const messagesService = require('../buisnessLogic/services/messages');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
  // var visitorSocket = io.of('/visitor');
  // var agentSocket = io.of('/agent');
  
  // require('./visitorSocket')(visitorSocket, agentSocket, io);
  // require('./agentSocket')(agentSocket, visitorSocket, io);

  io.on('connection', (socket) => {
      socket
          .on('init', init)
          .on('connectWithAgent', connectWithAgent)
          .on('locationChange', locationChange)
          .on('switchRoom', switchRoom)
          .on('disconnect', disconnect)
          .on('getLocation', getLocation)
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

          console.log("CONNECTION: " + socket.user + " " + socket.clientId);
      }

      function locationChange(location) {
          console.log("location visitor " + socket.room + " " + location)
          // agent
          console.log("VISITOR ROOM")
          console.log(io.sockets.adapter.rooms[socket.room])
          socket.to(socket.room).emit('locationChange', location);
          // console.log(io.sockets.adapter);
      }

      function getLocation(){
        console.log("AGENT ROOM")
        console.log(io.sockets.adapter.rooms[socket.room])
          console.log("getLocation agent " + socket.room)
          socket.to(socket.room).emit('getLocation');
          // io.sockets.in(socket.room).emit('getLocation');
      }

      async function connectWithAgent() {
          let checkIfExistChat = await chatService.findActiveByVisitorId(socket.clientId);
          console.log(!!checkIfExistChat)
          if(!checkIfExistChat) {
              firstChat();
          } else {
              nextChat(checkIfExistChat);
          }
      }

      async function firstChat(){
          socket.nextChat = false;
          let agent = await userService.findRandomWorkingUserByRepresentative(socket.representative);
          if(!agent){
              socket.emit('connectionWithAgent', null);
          }
          socket.agent = agent._id;

          let newChat = await chatService.create(socket.clientId, socket.agent)
          if(!newChat){
              socket.emit('error', "Can not create chat.");
          }
          socket.room = newChat._id;
          socket.join(socket.room);
          console.log("newChat: " + socket.room);

          socket.emit('connectionWithAgent', await chatService.findActiveByVisitorId(socket.clientId));
          socket.to(socket.agent).emit('newChat');
          socket.to(socket.agent).emit('updateChatList');
          // agent
          // agentSocket.emit('updateChatList');
          // agentSocket.emit('newChat');
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
          console.log("new message: " + content);
          const message = await messagesService.create(socket.room, content, socket.user);

          socket.emit('message', message);
          socket.to(socket.room).emit('message', message);
          socket.to(socket.agent).emit('newMessage', socket.room);
      }

      function switchRoom(room) {
          socket.leave(socket.room);
          socket.room = null;
          if(room !== socket.clientId) {
              socket.room = room;
              socket.join(room);
          }
          console.log("switchRoom socket.room: " + socket.room)
      }

      async function disconnect() {
          if(socket.user === "visitor"){
            if(!socket.nextChat) {
              console.log("DISCONNECT VISITOR: " + socket.room);
              let chat = await chatService.findById(socket.room);
              if(!chat){
                  console.log("DISCONNECT ERROR in: " + socket.room);
              }
              let updatedChat = chatService.updateActivity(chat)
              if(!updatedChat){
                  console.log("DISCONNECT ERROR in: " + socket.room);
              }
              socket.to(socket.agent).emit('updateChatList');
              socket.to(socket.room).emit('visitorDisconnect');
            }
            socket.leave(socket.room);
          }

          if(socket.user === "agent"){
            console.log('DISCONNECT AGENT');
            if(socket.room !== null){
                socket.leave(socket.room);
                // + notify visitors
            }
            socket.leave(socket.clientId);
          }
      }
  });
}