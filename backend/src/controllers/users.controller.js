const User = require('../models/User');

function safeUser(user) {
    return {
        id: user._id,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
        createdAt: user.createdAt,
        wishlist: user.wishlist,
        purchases: user.purchases
    };
}

async function getMe(req, res) {
    res.json(safeUser(req.user));
}

async function updateMe(req, res, next) {
    try {
        const allowed = ['username', 'avatarUrl', 'phone'];
        allowed.forEach(k => {
            if (req.body[k] !== undefined) req.user[k] = req.body[k];
        });
        await req.user.save();
        res.json(safeUser(req.user));
    } catch (err) { next(err); }
}

module.exports = { getMe, updateMe };
