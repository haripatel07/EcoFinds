const express = require('express');
const router = express.Router();

const { getMe, updateMe } = require('../controllers/users.controller');
const auth = require('../middleware/auth.middleware');

// Get current user profile
router.get('/me', auth, getMe);

// Update current user profile
router.put('/me', auth, updateMe);

module.exports = router;
