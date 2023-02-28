const { mongoose } = require("mongoose");

const ObjectId = mongoose.ObjectId;

const atendentesSchema = new mongoose.Schema({
    id: ObjectId,
    name: String,
    user: {
        type: String,
        unique: true
    },
    password: String,
    status: Boolean
});

const AtendentesModel = mongoose.model("atendentes", atendentesSchema);

module.exports = AtendentesModel;