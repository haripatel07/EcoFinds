const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');

async function connect() {
    if (!config.mongoUri) {
        throw new Error('MONGO_URI is not configured');
    }
    await mongoose.connect(config.mongoUri, { dbName: 'ecofinds' });
    logger.info('Connected to MongoDB');
}

async function disconnect() {
    await mongoose.disconnect();
}

module.exports = { connect, disconnect };
