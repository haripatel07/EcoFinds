const express = require('express');
const router = express.Router();

const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products.controller');
const auth = require('../middleware/auth.middleware');
const { checkProductOwner } = require('../middleware/ownership.middleware');
const { productCreate, productUpdate } = require('../utils/validators');
const validate = require('../middleware/validate.middleware');

// List all products
router.get('/', listProducts);

// Get single product
router.get('/:id', getProduct);

// Create new product
router.post('/', auth, productCreate, validate, createProduct);

// Update existing product
router.put('/:id', auth, checkProductOwner, productUpdate, validate, updateProduct);

// Delete product
router.delete('/:id', auth, checkProductOwner, deleteProduct);

module.exports = router;
