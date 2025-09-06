const Order = require('../models/Order');

async function listOrders(req, res, next) {
    const orders = await Order.find({ buyer: req.user._id }).lean();
    res.json(orders);
}

async function getOrder(req, res, next) {
    const order = await Order.findById(req.params.id).lean();
    if (!order) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
    if (String(order.buyer) !== String(req.user._id)) return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } });
    res.json(order);
}

module.exports = { listOrders, getOrder };
