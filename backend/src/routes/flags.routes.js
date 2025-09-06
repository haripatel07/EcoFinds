const express = require('express');
const router = express.Router();

const { flagProduct, listFlags } = require('../controllers/flags.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { flagCreate } = require('../utils/validators');
const requireAdmin = require('../middleware/admin.middleware');

// Flag a product (user)
router.post('/:id/flag', auth, flagCreate, validate, flagProduct);

// Admin only: list all flags
router.get('/', auth, requireAdmin, listFlags);

module.exports = router;
