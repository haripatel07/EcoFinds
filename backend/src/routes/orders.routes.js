const express = require('express');
const router = express.Router();
const { listOrders, getOrder } = require('../controllers/orders.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', auth, listOrders);
router.get('/:id', auth, getOrder);

module.exports = router;
