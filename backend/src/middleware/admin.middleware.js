function requireAdmin(req, res, next) {
    if (!req.user) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing user' } });
    if (req.user.role !== 'admin') return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Admin access required' } });
    next();
}

module.exports = requireAdmin;
