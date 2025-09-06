const Order = require('../models/Order');

async function listOrders(req, res, next) {
    try {
        const orders = await Order.find({ buyer: req.user._id }).lean();
        res.json(orders);
    } catch (err) { next(err); }
}

async function getOrder(req, res, next) {
    try {
        const order = await Order.findById(req.params.id).lean();
        if (!order) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Order not found' } });
        }
        if (String(order.buyer) !== String(req.user._id) && req.user.role !== 'admin') {
            return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Not allowed' } });
        }
        res.json(order);
    } catch (err) { next(err); }
}

module.exports = { listOrders, getOrder };
