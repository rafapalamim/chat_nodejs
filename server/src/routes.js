const router = require('express').Router();
const AtendentesController = require('./controllers/AtendentesController');
const ChatController = require('./controllers/ChatController');
const { validateJWT } = require('./helpers/jwt.js');

const allowedRoutesAuthorization = [
    '/chat/iniciar',
    '/login/atendente',
    '/users/atendente'
];

/* Separar middlewares em outro arquivo */
router.use(async (req, res, next) => {

    if (!allowedRoutesAuthorization.includes(req.url)) {
        const auth = req.headers.authorization ?? null;
        if (!auth) {
            return res.status(401).json({
                auth: false,
                token: null,
                message: "Autentique-se antes de continuar"
            });
        }

        const token = auth.split(' ')[1];
        const validateToken = await validateJWT(token);

        if (validateToken === false) {
            return res.status(406).json({
                auth: false,
                token: null,
                message: "Token de autenticação inválido. Autentique-se novamente."
            });
        }

        req.jwt = validateToken;
    }

    next();
});

/* External routes */
router.post('/chat/iniciar', ChatController.init);
router.post('/login/atendente', AtendentesController.logIn);
// router.get('/chat/dados', ChatController.find);
// router.post('/chat/enviar-mensagem', ChatController.saveMessage);
// router.get('/chat/conversa/:chatId', ChatController.findChatById);
// router.get('/chat/usuario/:userId', ChatController.findChatById);


/* Internal routes */

router.post('/users/atendente', AtendentesController.create);

module.exports = router;