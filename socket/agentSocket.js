module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.join(socket.id);
        console.log("CONNECTION: " + socket.id);

        socket
            .on('switchRoom', switchRoom)
            .on('disconnect', disconnect);

        function switchRoom(room) {
            socket.room = room;
            socket.join(room);
            console.log("socket.room: " + socket.room)
        }

        function disconnect() {
            console.log('DISCONNECT');
        }
    });
}