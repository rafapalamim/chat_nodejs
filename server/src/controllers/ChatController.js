const ConversaModel = require('./../models/ConversaModel.js');
const { createJWT, validateJWT } = require('./../helpers/jwt.js');

// const validate = async (data) => {

//     if (!data.name) {
//         throw Error("É necessário informar o campo 'name'");
//     }

//     if (!data.user) {
//         throw Error("É necessário informar o campo 'user'");
//     }

//     if (!data.password) {
//         throw Error("É necessário informar o campo 'password'");
//     }

//     if (!data.hasOwnProperty('status')) {
//         throw Error("É necessário informar o campo 'status'");
//     }
// }

const validateInit = async (data) => {

    if (!data.name) {
        throw Error("É necessário informar seu nome");
    }

    if (data.sendEmail === true && !data.email) {
        throw Error("Como solicitou que o histórico da conversa seja enviado por e-mail, você deve fornecer um e-mail válido");
    }

}

class ChatController {

    async init(req, res) {

        try {

            await validateInit(req.body);

            const userData = {
                name: req.body.name,
                identifiedBy: req.body.identifiedBy,
                email: req.body.email,
                ip: req.ip
            };

            const chatData = {
                user: userData,
                sendEmailToUser: req.body.sendEmail
            }

            const createChat = await ConversaModel.create(chatData);

            const payloadJWT = {
                chatId: createChat._id.valueOf(),
                userId: createChat.user._id.valueOf(),
                name: req.body.name
            };

            const jwt = await createJWT(payloadJWT);

            return res.status(200).json({
                auth: true,
                message: null,
                token: jwt,
                name: userData.name,
                identifiedBy: userData.identifiedBy
            });

        } catch (error) {

            return res.status(404).json({
                auth: false,
                message: error.message,
                token: null,
                name: null,
                identifiedBy: null
            });

        }

    }

    async find(req, res) {

        const chat = await ConversaModel.findOne({ _id: req.jwt.chatId });

        // if (chat.user._id.valueOf() != req.jwt.userId) {
        //     return res.status(403).send();
        // }

        return res.json(chat);
    }

    async saveMessage(req, res) {

        const messageData = {
            message: req.body.message,
            sendedBy: req.jwt.userId
        };

        const chat = await ConversaModel.findOne({ _id: req.jwt.chatId });

        if(!chat.startAt){
            chat.startAt = new Date();
        }

        chat.messages.push(messageData);
        chat.save();


        // if(chat.user._id.valueOf() != req.jwt.userId){
        //     return res.status(403).send();
        // }

        return res.json({ chat });
    }

}

module.exports = new ChatController();