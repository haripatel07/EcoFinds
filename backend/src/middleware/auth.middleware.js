const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

async function authMiddleware(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing Authorization header' } });
    }

    const token = auth.split(' ')[1];
    try {
        const payload = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(payload.id).select('-passwordHash').lean();
        if (!user) {
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'User not found' } });
        }
        req.user = user;
        next();
    } catch (err) {
        const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message } });
    }
}

module.exports = authMiddleware;
