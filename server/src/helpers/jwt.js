const jwt = require('jsonwebtoken');

const createJWT = async (payload) => {

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 60 * 60
    });

    return token;

}

const validateJWT = async (token) => {

    return await jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) return false;
        return decoded;
    });

}


module.exports = { createJWT, validateJWT };