const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    logger.error(err);
    const status = err.status || 500;
    res.status(status).json({ error: { code: err.code || 'INTERNAL_ERROR', message: err.message || 'Internal server error' } });
}

module.exports = errorHandler;
