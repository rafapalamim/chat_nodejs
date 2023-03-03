const { mongoose } = require("mongoose");

const userId = mongoose.ObjectId;
const chatId = mongoose.ObjectId;
const messageId = mongoose.ObjectId;

const messageSchema = new mongoose.Schema({
    id: messageId,
    message: String,
    sendedBy: String,
    senderName: String,
    sendedAt: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    id: userId,
    name: String,
    identifiedBy: String,
    email: String,
    ip: String
});


const chatSchema = new mongoose.Schema({
    id: chatId,
    user: userSchema,
    messages: [messageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    finishBy: String,
    startAt: Date,
    finishAt: Date,
    sendEmailToUser: Boolean
});

const ConversaModel = mongoose.model("conversa", chatSchema);

module.exports = ConversaModel;