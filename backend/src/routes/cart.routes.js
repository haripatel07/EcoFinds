const express = require('express');
const router = express.Router();

const {
  getCart,
  postCart,
  putCart,
  deleteCartItem,
  checkout,
} = require('../controllers/cart.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { cartPost, cartPut } = require('../utils/validators');

// Get current user's cart
router.get('/', auth, getCart);

// Add item to cart
router.post('/', auth, cartPost, validate, postCart);

// Update cart item qty
router.put('/', auth, cartPut, validate, putCart);

// Remove item from cart
router.delete('/:productId', auth, deleteCartItem);

// Checkout cart
router.post('/checkout', auth, checkout);

module.exports = router;
