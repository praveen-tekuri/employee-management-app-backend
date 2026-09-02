const mongoose = require("mongoose");
const {MongoMemoryServer} = require("mongodb-memory-server");

const connectDB = async () => {
    try {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log(`Connected to database at: ${uri}`);
    } catch (error) {
        console.error("Database Connection Failed: ", error);
    }
}

module.exports = connectDB;