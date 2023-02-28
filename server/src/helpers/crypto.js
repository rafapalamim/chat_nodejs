const bcrypt = require('bcryptjs');
const saltValue = 10;

const generate = async (value) => {
    return await bcrypt.hashSync(value, bcrypt.genSaltSync(saltValue));
}

const compare = async (originalValue, valueCrypted) => {
    return await bcrypt.compareSync(originalValue, valueCrypted);
}

module.exports = { generate, compare };