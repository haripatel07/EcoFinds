const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire });
}

async function sendVerificationEmail(to, token) {
  try {
    if (!config.email.user || !config.email.pass) {
      logger.warn('Email credentials not configured, skipping send');
      return;
    }

    const transporter = nodemailer.createTransport({
      host: config.email.host || undefined,
      service: config.email.service || undefined,
      port: config.email.port || undefined,
      secure: false,
      auth: { user: config.email.user, pass: config.email.pass },
    });

    const verifyUrl = `${
      process.env.BASE_URL || 'http://localhost:' + config.port
    }/api/auth/verify-email?token=${token}`;

    const info = await transporter.sendMail({
      from: config.email.from || config.email.user,
      to,
      subject: 'Verify your EcoFinds account',
      text: `Click to verify: ${verifyUrl}`,
      html: `<p>Click to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    logger.info('Verification email sent', { messageId: info.messageId });
  } catch (err) {
    logger.error('Failed to send verification email', { error: err.message });
  }
}

module.exports = { signToken, sendVerificationEmail };
