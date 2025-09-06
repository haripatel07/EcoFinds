const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getWishlist, toggleWishlist } = require('../controllers/wishlist.controller');

router.get('/', auth, getWishlist);
router.post('/:productId', auth, toggleWishlist);

module.exports = router;
