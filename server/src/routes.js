const router = require('express').Router();

// const allowedRoutesAuthorization = [
//     '/'
// ];

// router.use((req, res, next) => {
//     if (allowedRoutesAuthorization.includes(req.url)) {
//         console.log('Rota com middleware 1');
//     }
//     next();
// });

router.post('/login/cliente', (req, res) => {
    res.send(req.body);
});

router.post('/login/atendente', (req, res) => {
    res.send('Atendente');
});

module.exports = router;