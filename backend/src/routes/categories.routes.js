const express = require('express');
const router = express.Router();

const {
  listCategories,
  createCategory,
} = require('../controllers/categories.controller');
const validate = require('../middleware/validate.middleware');
const { categoryCreate } = require('../utils/validators');
const auth = require('../middleware/auth.middleware');
const requireAdmin = require('../middleware/admin.middleware');

// Public: list categories
router.get('/', listCategories);

// Admin only: create new category
router.post('/', auth, requireAdmin, categoryCreate, validate, createCategory);

module.exports = router;
