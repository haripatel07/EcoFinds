const express = require('express');
const router = express.Router();
const { register, login, verifyEmail } = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { register: registerRules, login: loginRules } = require('../utils/validators');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/verify-email', verifyEmail);

module.exports = router;
