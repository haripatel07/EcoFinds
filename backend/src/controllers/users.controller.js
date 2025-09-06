const User = require('../models/User');

async function getMe(req, res, next) {
    res.json({ id: req.user._id, email: req.user.email, username: req.user.username, avatarUrl: req.user.avatarUrl, phone: req.user.phone, isPhoneVerified: req.user.isPhoneVerified, isEmailVerified: req.user.isEmailVerified, role: req.user.role, createdAt: req.user.createdAt, wishlist: req.user.wishlist, purchases: req.user.purchases });
}

async function updateMe(req, res, next) {
    const allowed = ['username', 'avatarUrl', 'phone'];
    allowed.forEach(k => { if (req.body[k] !== undefined) req.user[k] = req.body[k]; });
    await req.user.save();
    res.json({ id: req.user._id, email: req.user.email, username: req.user.username, avatarUrl: req.user.avatarUrl, phone: req.user.phone, isPhoneVerified: req.user.isPhoneVerified, isEmailVerified: req.user.isEmailVerified, role: req.user.role, createdAt: req.user.createdAt, wishlist: req.user.wishlist, purchases: req.user.purchases });
}

module.exports = { getMe, updateMe };
