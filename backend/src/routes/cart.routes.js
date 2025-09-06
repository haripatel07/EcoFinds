const express = require('express');
const router = express.Router();
const { getCart, postCart, deleteCartItem, checkout, putCart } = require('../controllers/cart.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { cartPost, cartPut } = require('../utils/validators');

router.get('/', auth, getCart);
router.post('/', auth, cartPost, validate, postCart);
router.put('/', auth, cartPut, validate, putCart);
router.delete('/:productId', auth, deleteCartItem);
router.post('/checkout', auth, checkout);

// alias checkout per API.md
// POST /api/checkout will be registered centrally in app.js

module.exports = router;
