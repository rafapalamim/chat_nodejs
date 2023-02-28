const { mongoose } = require("mongoose");

async function startDB() {
    await mongoose.connect('mongodb://admin:root@db:27017/chat?authSource=admin');
}

module.exports = startDB;