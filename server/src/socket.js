const { validateJWT } = require('./helpers/jwt.js');
const ConversaModel = require('./models/ConversaModel.js');
const SalasModel = require('./models/SalasModel.js');

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
        io.to(soc.socketId).emit(event, message);
    }
}

const findSocketsByChatId = async (chatId, connections, sender, rooms) => {

    const data = {};
    const userIdAtendente = rooms.rooms.get(chatId);

    const clientSocket = await connections.clients.filter((user) => {
        return user.socketJwt.chatId == chatId;
    });

    const atendenteSocket = await connections.atendentes.filter((user) => {
        return user.socketJwt.id == userIdAtendente;
    });

    data.sender = sender.hasOwnProperty('atendente') ? atendenteSocket[0].socketId : clientSocket[0].socketId;
    data.receiver = sender.hasOwnProperty('atendente') ? clientSocket[0].socketId : atendenteSocket[0].socketId;
    data.senderInfo = sender.hasOwnProperty('atendente') ? 'atendente' : 'cliente';

    return data;
}

const joinChat = async (io, chatId, atendenteId, rooms) => {
    console.log(`Vincular o chat ${chatId} ao atendente ${atendenteId}`);
    rooms.rooms.set(chatId, atendenteId);
    rooms.save();
    const connections = await reloadConnections(io);
    sendMessageToAtendentes(io, connections.atendentes, 'chat:list', Object.fromEntries(rooms.rooms));
};

const getChat = async (chatId) => {
    const chat = await ConversaModel.findOne({ _id: chatId });
    return chat;
}

const socketHandler = async (io) => {

    console.log('============================================');
    console.log('Carregando salas...');
    const rooms = await SalasModel.findOne();
    if(!rooms){
        return SalasModel.create({});
    }

    io.on('connection', async function (socket) {

        const userData = socket.handshake.query;
        const senderJwtData = await validateJWT(userData.token);
        
        console.log('Usuário conectado: ' + (senderJwtData.atendente ? 'atendente' : 'usuario'));

        socket.on('perfil:busca', async function () {

            console.log('Socket = perfil:busca');
            const perfil = {
                name: senderJwtData.name,
                atendente: senderJwtData.atendente ?? false,
                userId: senderJwtData.hasOwnProperty('userId') ? senderJwtData.userId : senderJwtData.id,
                chatId: senderJwtData.hasOwnProperty('chatId') ? senderJwtData.chatId : null
            }
            io.to(socket.id).emit('perfil:retorno', perfil);

            console.log('Socket = Mandando lista de atendentes e usuários, além das salas, para os atendentes ao conectar no socket');
            const connections = await reloadConnections(io);
            sendMessageToAtendentes(io, connections.atendentes, 'lista:usuarios', {
                clientes: connections.clients,
                atendentes: connections.atendentes
            });
            sendMessageToAtendentes(io, connections.atendentes, 'chat:list', Object.fromEntries(rooms.rooms));

            if (perfil.atendente === false) {
                console.log('Socket = Mandar chat ao cliente ao conectar')
                const chat = await getChat(perfil.chatId);
                io.to(socket.id).emit('chat:in', chat);
            }

        });

        socket.on('chat:join', function (chatId) {
            console.log('Socket = Vinculando atendente ao cliente');
            joinChat(io, chatId, senderJwtData.id, rooms);
        });

        socket.on('chat:enter', async function (chatId) {
            console.log('Socket = Atendente entrou no chat ' + chatId);
            const connections = await reloadConnections(io);
            const sockets = await findSocketsByChatId(chatId, connections, senderJwtData, rooms);

            // Devolver histórico da conversa
            const chat = await ConversaModel.findOne({ _id: chatId });
            if (!chat.startAt) {
                chat.startAt = new Date();
            }

            if (chat.messages.length < 1) {
                chat.messages.push({
                    message: "Seja bem-vindo(a)! No que posso ajudar?",
                    sendedBy: senderJwtData.id,
                    senderName: senderJwtData.name
                });
            }

            await chat.save();

            io.to(socket.id).emit('chat:in', chat);
            // io.to(sockets.receiver).emit('chat:in', chat);
        });

        socket.on('chat:message:send', async function (data) {
            console.log('Socket = message: ', data);

            const connections = await reloadConnections(io);
            const sockets = await findSocketsByChatId(data.chatId, connections, senderJwtData, rooms);

            const chat = await getChat(data.chatId);

            const message = {
                message: data.message,
                sendedBy: senderJwtData.hasOwnProperty('id') ? senderJwtData.id : senderJwtData.userId,
                senderName: senderJwtData.name,
                sendedAt: new Date()
            };

            chat.messages.push(message);

            await chat.save();

            io.to(sockets.receiver).emit('chat:message:receive', chat);
            io.to(socket.id).emit('chat:message:receive', chat);
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