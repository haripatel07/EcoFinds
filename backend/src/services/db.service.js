const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');

async function connect() {
  if (!config.mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  try {
    await mongoose.connect(config.mongoUri, { dbName: 'ecofinds' });
    logger.info('Connected to MongoDB');
  } catch (err) {
    logger.error('MongoDB connection error', { error: err.message });
    throw err;
  }
}

async function disconnect() {
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
}

module.exports = { connect, disconnect };
