const { mongoose } = require("mongoose");

const roomId = mongoose.ObjectId;

const roomSchema = new mongoose.Schema({
    id: roomId,
    rooms: {
        type: Map,
        default: new Map()
    }
});

const SalasModel = mongoose.model("salas", roomSchema);

module.exports = SalasModel;