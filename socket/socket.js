const chatService = require('../buisnessLogic/services/chats');
const messagesService = require('../buisnessLogic/services/messages');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
    io.on('connection', (socket) => {
        var pingCount = 0;
        var refreshIntervalId = null;

        socket
            .on('init', init)
            .on('connectWithAgent', connectWithAgent)
            .on('locationChange', locationChange)
            .on('switchRoom', switchRoom)
            .on('disconnect', disconnect)
            .on('getLocation', getLocation)
            .on('closeChat', agentCloseChat)
            .on('pingServer', pingServer)
            .on('message', message);

        function init(token, user){
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                socket.userId = decoded.id;
                socket.representative = decoded.representative;
            });

            socket.user = user;
            socket.room = null;

            if(user === "agent") {
                socket.agentRoom = socket.userId;
                socket.join(socket.agentRoom);
            }
        }

        function locationChange(location) {
            socket.to(socket.room).emit('locationChange', location);
        }

        function getLocation(){
            socket.to(socket.room).emit('getLocation');
        }

        async function connectWithAgent(agentId) {
            resetCount();
            let existChat = await chatService.findActiveByVisitorId(socket.userId);
            if(agentId !== null && !existChat) {
                firstChat(agentId);
            } else {
                nextChat(existChat);
            }
        }

        async function firstChat(agentId){
            socket.nextChat = false;
            socket.agent = agentId;

            let newChat = await chatService.create(socket.userId, socket.agent)
            if(!newChat){
                socket.emit('error', "Can not create chat.");
            }
            socket.room = newChat._id;
            socket.join(newChat._id);

            let thisChat = await chatService.findActiveByVisitorId(socket.userId);

            socket.emit('connectionWithAgent', await chatService.findActiveByVisitorId(socket.userId));

            socket.to(socket.agent).emit('newChat');
            socket.to(socket.agent).emit('updateChatList', thisChat);
        }

        async function nextChat(chat){
            socket.nextChat = true; 
            socket.agent = chat.agent._id;
            socket.room = chat._id;

            socket.join(chat._id);
            socket.emit('nextChat', chat);
        }

        async function message(content){
            const message = await messagesService.create(socket.room, content, socket.user);

            socket.emit('message', message);
            socket.to(socket.room).emit('message', message);

            if(socket.user === 'visitor'){
                socket.to(socket.agent).emit('message', message);
                socket.to(socket.agent).emit('newChat');
            }
        }

        function switchRoom(room) {
            socket.leave(socket.room);
            socket.room = null;
            if(room !== socket.userId) {
                socket.room = room;
                socket.join(room);
            }
        }

        async function disconnect() {
            if(socket.user === "visitor") await disconnectVisitor();
            if(socket.user === "agent") await disconnectAgent();
        }

        async function disconnectVisitor(){
            let existChat = await chatService.findActiveByVisitorId(socket.userId);
            if(!existChat) 
                socket.to(socket.agent).emit('visitorDisconnect', socket.room);
            socket.leave(socket.room);
        }

        async function emitCheckIfChatting(){
            if(parseInt(socket.pingCount) !== pingCount &&
                checkRoom()) clearInterval(refreshIntervalId);
            if(parseInt(socket.pingCount) !== pingCount &&
                !checkRoom()){
                let chat = await chatService.findById(socket.room);
                if(!chat){
                    console.log("DISCONNECT ERROR in: " + socket.room);
                }
                let updatedChat = chatService.updateActivityFalse(chat)
                if(!updatedChat){
                    console.log("DISCONNECT ERROR in: " + socket.room);
                }
                disconnectVisitor()
            } else {
                if(socket.room !== null){
                    pingCount = pingCount + 1;
                    console.log("pingCount pingVisitor")
                    console.log(pingCount)
                    socket.emit('pingVisitor');
                }
            }
        }

        function checkRoom(){
            let room = io.sockets.adapter.rooms[socket.room]
            return room && (room.length !== 1  || 
                (room.length === 1 && io.sockets.connected[Object.keys(room.sockets)[0]].user !== 'agent'))
        }

        function resetCount(){
            pingCount = 0;
            socket.pingCount = 0;
            refreshIntervalId = setInterval(emitCheckIfChatting, 10000);
            console.log(io.sockets.adapter.rooms)
        }

        function pingServer(){
            socket.pingCount = parseInt(socket.pingCount) + 1;
            console.log("socket.pingCount")
            console.log(socket.pingCount)
        }

        async function disconnectAgent(){
            if(!socket.nextChat) {
                if(socket.room !== null){
                    socket.leave(socket.room);
                }
            }
            socket.leave(socket.userId);
        }

        async function agentCloseChat() {
            let chat = await chatService.findById(socket.room);
            if(!chat){
                socket.emit('error', "Can not found chat.");
            }

            let updatedChat = chatService.updateActivityFalse(chat)
            if(!updatedChat){
                socket.emit('error', "Can not update chat.");
            }

            socket.to(socket.room).emit('agentDisconnect');
            socket.leave(socket.room);
        }
    });
}