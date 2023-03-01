const { validateJWT } = require('./helpers/jwt.js');

const socketHandler = (io) => {
    io.on('connection', async function (socket) {
        console.log('user connected');

        /**
         * Inicializando contabilização dos sockets
         */
        const userData = socket.handshake.query;
        const senderJwtData = await validateJWT(userData.token);
        // console.log(senderJwtData);

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

        // console.log('atendentes:', listSocketsAtendentes);
        // console.log('clientes:', listSocketsClients);

        if (senderJwtData.atendente) {
            io.emit('atendente entrou', listSocketsAtendentes);
        }

        socket.on('buscar perfil', async function () {

            const perfil = {
                atendente: senderJwtData.atendente ?? false
            }

            io.to(socket.id).emit('retorno perfil', perfil);
        });

        socket.on('message', function (msg) {
            console.log(socket.handshake.query, msg);
        });

        socket.on('disconnect', function () {
            console.log('Saiu');
        })
    });
}

module.exports = socketHandler