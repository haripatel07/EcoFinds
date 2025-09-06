const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signToken, sendVerificationEmail } = require('../services/auth.service');
const config = require('../config');

async function register(req, res, next) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'All fields required' } });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Password too short' } });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: { code: 'CONFLICT', message: 'Email already in use' } });
        }

        const hash = await bcrypt.hash(password, config.bcryptRounds);
        const user = await User.create({ email, passwordHash: hash, username });

        const verifyToken = signToken({ id: user._id, verify: true }, '30m'); // verification token
        await sendVerificationEmail(user, verifyToken).catch(() => { });
        res.status(201).json({
            user: { id: user._id, email: user.email, username: user.username },
            message: 'Registration successful. Please verify your email before logging in.'
        });
    } catch (err) { next(err); }
}

async function verifyEmail(req, res, next) {
    const token = req.query.token;
    if (!token) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Missing token' } });

    try {
        const payload = jwt.verify(token, config.jwtSecret);
        if (!payload.verify) {
            return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Invalid token' } });
        }
        const user = await User.findById(payload.id);
        if (!user) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        }
        user.isEmailVerified = true;
        await user.save();
        res.json({ message: 'Email verified successfully' });
    } catch {
        return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Invalid or expired token' } });
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
        }
        if (!user.isEmailVerified) {
            return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Please verify your email before login' } });
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
        }
        const token = signToken({ id: user._id });
        res.json({
            user: { id: user._id, email: user.email, username: user.username },
            token
        });
    } catch (err) { next(err); }
}

async function resendVerification(req, res, next) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Email required' } });
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found' } });
        if (user.isEmailVerified) return res.json({ message: 'Already verified' });
        const verifyToken = signToken({ id: user._id, verify: true }, '30m');
        await sendVerificationEmail(user, verifyToken).catch(() => { });
        res.json({ message: 'Verification email resent' });
    } catch (err) { next(err); }
}
module.exports = { register, login, verifyEmail, resendVerification };
