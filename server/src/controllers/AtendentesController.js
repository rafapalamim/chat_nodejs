const AtendentesModel = require('./../models/AtendentesModel.js');
const { generate, compare } = require('./../helpers/crypto.js');
const { createJWT, validateJWT } = require('./../helpers/jwt.js');

const validate = async (data) => {

    if (!data.name) {
        throw Error("É necessário informar o campo 'name'");
    }

    if (!data.user) {
        throw Error("É necessário informar o campo 'user'");
    }

    if (!data.password) {
        throw Error("É necessário informar o campo 'password'");
    }

    if (!data.hasOwnProperty('status')) {
        throw Error("É necessário informar o campo 'status'");
    }
}

class AtendentesController {

    async create(req, res) {

        try {

            await validate(req.body);

            req.body.password = await generate(req.body.password);

            const createAtendente = await AtendentesModel.create(req.body);
            return res.status(200).json(createAtendente);

        } catch (error) {
            return res.status(400).json({
                message: error.message
            });
        }

    }

    async logIn(req, res) {

        try {

            const user = await AtendentesModel.findOne({ user: req.body.user });

            if (!user) {
                return res.status(406).json({
                    auth: false,
                    token: null,
                    message: 'Falha ao se autenticar. Revise os dados e tente novamente.'
                });
            }

            const validatePassword = await compare(req.body.password, user.password);

            if (!validatePassword) {
                return res.status(406).json({
                    auth: false,
                    token: null,
                    message: 'Falha ao se autenticar. Revise os dados e tente novamente.'
                });
            }
            
            const tokenJwt = await createJWT({
                id: user._id.valueOf(),
                name: user.name,
                status: user.status,
                atendente: true
            });

            return res.status(200).json({
                auth: true,
                message: null,
                token: tokenJwt,
                name: user.name
            });

        } catch (error) {
            return res.status(400).json({
                auth: false,
                message: error.message,
                token: null,
                name: null
            });
        }

    }

}

module.exports = new AtendentesController();