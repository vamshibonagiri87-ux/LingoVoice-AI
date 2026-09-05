const mongoose = require('mongoose');
const config = require('./env');

let isInMemory = false;
let mongoServer = null;

const connectDB = async () => {
  try {
    // First, try standard connection with a short timeout
    mongoose.set('strictQuery', false);
    
    // Attempt standard connection
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    isInMemory = false;
    return conn;
  } catch (err) {
    console.warn(`[Database] Native MongoDB connection failed: ${err.message}. Starting in-memory MongoDB fallback...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(inMemoryUri);
      isInMemory = true;
      console.log(`[Database] In-Memory MongoDB Connected at ${inMemoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[Database] In-memory MongoDB failed: ${memErr.message}`);
      throw memErr;
    }
  }
};

const getDbStatus = () => {
  const state = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: isInMemory ? 'connected-in-memory' : 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return stateMap[state] || 'unknown';
};

module.exports = { connectDB, getDbStatus, isInMemory: () => isInMemory };
