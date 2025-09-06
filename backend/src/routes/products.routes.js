const express = require('express');
const router = express.Router();
const { listProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products.controller');
const auth = require('../middleware/auth.middleware');
const { checkProductOwner } = require('../middleware/ownership.middleware');
const { productCreate, productUpdate } = require('../utils/validators');
const validate = require('../middleware/validate.middleware');
const { flagProduct } = require('../controllers/flags.controller');

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', auth, productCreate, validate, createProduct);
router.put('/:id', auth, checkProductOwner, productUpdate, validate, updateProduct);
router.delete('/:id', auth, checkProductOwner, deleteProduct);
router.post('/:id/flag', auth, flagProduct);

module.exports = router;
