const express = require('express');
const router = express.Router();

const { listOrders, getOrder } = require('../controllers/orders.controller');
const auth = require('../middleware/auth.middleware');

// List orders for logged-in user
router.get('/', auth, listOrders);

// Get a specific order
router.get('/:id', auth, getOrder);

module.exports = router;
