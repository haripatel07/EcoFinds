const config = require('../config');

const map = new Map();

function rateLimit(req, res, next) {
    const key = req.ip;
    const now = Date.now();
    const entry = map.get(key) || { count: 0, start: now };
    if (now - entry.start > config.rateLimit.windowMs) {
        entry.count = 0; entry.start = now;
    }
    entry.count += 1;
    map.set(key, entry);
    if (entry.count > config.rateLimit.max) {
        return res.status(429).json({ error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded' } });
    }
    next();
}

module.exports = rateLimit;
