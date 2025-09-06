const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

const fs = require('fs');
const path = require('path');

function signToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire });
}

async function sendVerificationEmail(user, token) {
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

    const verifyUrl = `${process.env.BASE_URL || 'http://localhost:' + config.port
      }/api/auth/verify-email?token=${token}`;

    // Load and populate the HTML template
    const templatePath = path.join(__dirname, '..', 'templates', 'verificationTemplate.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    htmlTemplate = htmlTemplate.replace('{{username}}', user.username);
    htmlTemplate = htmlTemplate.replace(/{{verification_link}}/g, verifyUrl);

    const info = await transporter.sendMail({
      from: `EcoFinds <${config.email.from || config.email.user}>`,
      to: user.email,
      subject: 'Verify Your EcoFinds Account',
      html: htmlTemplate,
      // Fallback for clients that don't support HTML
      text: `Welcome to EcoFinds, ${user.username}! Please verify your account by visiting this URL: ${verifyUrl}`,
    });

    logger.info('Verification email sent', { messageId: info.messageId });
  } catch (err) {
    logger.error('Failed to send verification email', { error: err.message });
  }
}

module.exports = { signToken, sendVerificationEmail };
