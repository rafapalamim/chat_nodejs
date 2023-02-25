const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

io.on('connection', (socket) => {

    const allUsers = [];

    io.sockets.sockets.forEach((listener) => {        
        allUsers.push(listener.id);
    });

    io.emit('userConnected', allUsers);

    socket.on('chat message', (msg) => {
        io.emit('chat message', `${socket.id}: ${msg}`);
    });

    socket.on('typing', (isTyping) => {
        if(isTyping){
            socket.broadcast.emit('isTyping', socket.id);
        }else{
            socket.broadcast.emit('isTyping', null);
        }        
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        console.log(`${socket.id}: saiu`);
    });
});

server.listen(3005, () => {
    console.log('listening on *:3005');
});