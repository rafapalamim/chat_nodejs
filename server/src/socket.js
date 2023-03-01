module.exports = function (io) {
    io.on('connection', function (socket) {
        console.log('user connected');
        socket.emit("message", "Fala meu amigo");

        socket.on('message', function (msg) {
            console.log(socket.handshake.query, msg);
        });
    });
};