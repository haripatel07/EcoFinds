const app = require('./app');
const db = require('./services/db.service');
const config = require('./config');
const logger = require('./utils/logger');

async function start() {
    try {
        await db.connect();
        app.listen(config.port, () => logger.info(`Server started on port ${config.port}`));
    } catch (err) {
        logger.error('Failed to start', err);
        process.exit(1);
    }
}

start();
