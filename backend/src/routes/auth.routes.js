const express = require('express');
const { query } = require('express-validator');
const router = express.Router();

const { register, login, verifyEmail, resendVerification } = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { register: registerRules, login: loginRules } = require('../utils/validators');

// Register new user
router.post('/register', registerRules, validate, register);

// Login existing user
router.post('/login', loginRules, validate, login);

// Verify email
router.get(
  '/verify-email',
  [query('token').notEmpty().withMessage('Verification token required')],
  validate,
  verifyEmail
);

// Resend verification
router.post('/resend-verification', resendVerification);

module.exports = router;
