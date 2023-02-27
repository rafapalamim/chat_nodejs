/** Iniciando estrutura do serviço */
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

/** Configurando banco de dados */
//...

/** Setando as rotas */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('./routes.js'));

/** Configurações de socket */
require('./socket.js')(io);

/** Subindo serviço */
server.listen(3000, () => {
    console.log('listening on *:3000');
});