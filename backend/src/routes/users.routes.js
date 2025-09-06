const express = require('express');
const router = express.Router();
const { getMe, updateMe } = require('../controllers/users.controller');
const auth = require('../middleware/auth.middleware');

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

module.exports = router;
