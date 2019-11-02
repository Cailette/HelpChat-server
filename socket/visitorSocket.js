const userService = require('../buisnessLogic/services/users');
const visitorService = require('../buisnessLogic/services/visitors');
const chatService = require('../buisnessLogic/services/chats');
const messagesService = require('../buisnessLogic/services/messages');
const jwt = require('jsonwebtoken');

module.exports = (visitorSocket, agentSocket) => {
    visitorSocket.on('connection', (socket) => {
        socket
            .on('init', init)
            .on('connectWithAgent', connectWithAgent)
            .on('locationChange', locationChange)
            .on('disconnect', disconnect)
            .on('message', message);

        function init(token){
            // const token = socket.handshake.query.token;
            jwt.verify(token, 'HelpChatRestApi', (err, decoded) => {
                socket.id = decoded.id;
                socket.representative = decoded.representative;
            });
            console.log("VISITOR CONNECTION: " + socket.room);
        }

        function locationChange(location) {
            console.log("location visitor " + socket.room + " " + location + " " + Boolean(agentSocket))
            // agent
            // agentSocket.emit('locationChange', location);
        }

        async function connectWithAgent() {
            let checkIfExistChat = await chatService.findActiveByVisitorId(socket.id);
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

            let newChat = await chatService.create(socket.id, socket.agent)
            if(!newChat){
                socket.emit('error', "Can not create chat.");
            }
            socket.room = newChat._id;
            socket.join(socket.room);
            console.log("newChat: " + socket.room);

            visitorSocket.emit('connectionWithAgent', agent, newChat);
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
            const message = await messagesService.create(socket.room, content, "visitor");

            socket.emit('message', message);
            // agent
            // agentSocket.in(socket.room).emit('message', message);
            // agentSocket.in(socket.agent).emit('newMessage', socket.room);
        }

        async function disconnect() {
            if(!socket.nextChat) {
                console.log("Disconnect: " + socket.room);
                let chat = await chatService.findById(socket.room);
                if(!chat){
                    console.log("Disconnect ERROR in: " + socket.room);
                }
                let updatedChat = chatService.updateActivity(chat)
                if(!updatedChat){
                    console.log("Disconnect ERROR in: " + socket.room);
                }
                // agent
                agentSocket.in(socket.agent).emit('updateChatList');
            }
            socket.leave(socket.room);
        }
    });
}