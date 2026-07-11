const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const isConnectionRefused = error?.message?.includes("ECONNREFUSED") || error?.code === "ECONNREFUSED";

    if (isConnectionRefused) {
      console.warn("MongoDB not reachable at the configured URI. Starting an in-memory MongoDB instance...");
      memoryServer = await MongoMemoryServer.create();
      const conn = await mongoose.connect(memoryServer.getUri());
      console.log(`MongoDB Connected via in-memory server: ${conn.connection.host}`);
      return;
    }

    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
