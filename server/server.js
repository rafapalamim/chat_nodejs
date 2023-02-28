/** Iniciando estrutura do serviço */
require('dotenv-safe').config();
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

/** Inicializando banco de dados */
require('./src/database.js')();

/** Setando as rotas */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.set('trust proxy', true)
app.use(require('./src/routes.js'));

/** Configurações de socket */
require('./src/socket.js')(io);

/** Subindo serviço */
server.listen(3000, () => {
    console.log('listening on *:3000');
});