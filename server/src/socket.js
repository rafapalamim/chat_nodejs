const { validateJWT } = require('./helpers/jwt.js');

const reloadConnections = async (io) => {

    const sockets = await io.fetchSockets();
    const listSocketsClients = [];
    const listSocketsAtendentes = [];

    for (var soc of sockets) {
        let jwt = await validateJWT(soc.handshake.query.token);

        if (jwt.atendente === true) {
            listSocketsAtendentes.push({
                socketId: soc.id,
                socketData: soc.handshake.query,
                socketJwt: jwt
            });
        } else {
            listSocketsClients.push({
                socketId: soc.id,
                socketData: soc.handshake.query,
                socketJwt: await validateJWT(soc.handshake.query.token)
            });
        }
    }
    return {
        clients: listSocketsClients,
        atendentes: listSocketsAtendentes
    }
}

const sendMessageToAtendentes = (io, atendentesSocket, event, message) => {
    for (var soc of atendentesSocket) {
        console.log(soc.socketId, soc.socketJwt.name);
        io.to(soc.socketId).emit(event, message);
    }
}

const joinChat = (io, chatId, atendenteId, clientes) => {
    for (var soc of clientes) {
        if (chatId == soc.socketJwt.chatId) {
            // console.log(soc);
            console.log(`Vincular ao chat ${soc.socketJwt.chatId} e socket ${soc.socketId} o atendente ${atendenteId}`);
            // console.log(chatId, atendenteId, soc);
            // soc.atendente = atendenteId;
        }
        // console.log(soc.socketId, soc.socketJwt.name);
        // io.to(soc.socketId).emit(event, message);
    }
};

const socketHandler = (io) => {
    io.on('connection', async function (socket) {

        const userData = socket.handshake.query;
        const senderJwtData = await validateJWT(userData.token);

        console.log('============================================');
        console.log('Usuário conectado: ' + (senderJwtData.atendente ? 'atendente' : 'usuario'));

        socket.on('perfil:busca', async function () {

            console.log('Socket = perfil:busca');
            const perfil = {
                atendente: senderJwtData.atendente ?? false
            }
            io.to(socket.id).emit('perfil:retorno', perfil);

            console.log('Socket = Mandando lista de atendentes e usuários para os atendentes ao conectar no socket');
            const connections = await reloadConnections(io);
            sendMessageToAtendentes(io, connections.atendentes, 'lista:usuarios', {
                clientes: connections.clients,
                atendentes: connections.atendentes
            });

        });

        socket.on('chat:join', async function (chatId) {
            console.log('Socket = Vinculando atendente ao cliente');
            const connections = await reloadConnections(io);
            joinChat(io, chatId, senderJwtData.id, connections.clients);
        });

        socket.on('message', function (msg) {
            console.log('Socket = message');
            // console.log(socket.handshake.query, msg);
        });

        socket.on('disconnect', async function () {
            const connections = await reloadConnections(io);
            console.log('Socket = Enviando mensagem aos atendentes que o usuario/atendente desconectou');
            sendMessageToAtendentes(io, connections.atendentes, 'lista:usuarios', {
                clientes: connections.clients,
                atendentes: connections.atendentes
            });
            console.log('============================================');
        })
    });
}

module.exports = socketHandler