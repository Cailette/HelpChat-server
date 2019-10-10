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
            socket.location = room;
            socket.join(room);
            console.log("socket.room: " + socket.location)
            io.in(socket.location).emit('locationChange', "New visitor");
        }

        function disconnect() {
            console.log('DISCONNECT');
        }
    });
}