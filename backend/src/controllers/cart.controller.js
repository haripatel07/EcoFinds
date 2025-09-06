const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

async function getCart(req, res, next) {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product').lean();
    if (!cart) cart = { user: req.user._id, items: [] };
    res.json(cart);
}

async function postCart(req, res, next) {
    const { productId, qty } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.available) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not available' } });
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    const existing = cart.items.find(i => i.product.equals(product._id));
    if (existing) { existing.qty = (existing.qty || 0) + (qty || 1); }
    else { cart.items.push({ product: product._id, qty: qty || 1, priceAtAdd: product.price }); }
    cart.updatedAt = Date.now();
    await cart.save();
    res.json(await cart.populate('items.product'));
}

async function deleteCartItem(req, res, next) {
    const productId = req.params.productId;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Cart not found' } });
    cart.items = cart.items.filter(i => !i.product.equals(productId));
    await cart.save();
    res.json(cart);
}

async function checkout(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product').session(session);
        if (!cart || cart.items.length === 0) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Cart empty' } });
        const items = [];
        let total = 0;
        for (const it of cart.items) {
            const prod = await Product.findOneAndUpdate({ _id: it.product._id, available: true }, { $set: { available: false } }, { new: true, session });
            if (!prod) {
                await session.abortTransaction();
                return res.status(409).json({ error: { code: 'CONFLICT', message: `Product ${it.product._id} not available` } });
            }
            items.push({ product: prod._id, seller: prod.seller, title: prod.title, price: it.priceAtAdd, qty: it.qty });
            total += it.priceAtAdd * it.qty;
        }
        const order = await Order.create([{ buyer: req.user._id, items, totalAmount: total }], { session });
        // clear cart
        await Cart.updateOne({ user: req.user._id }, { $set: { items: [] } }).session(session);
        // add purchase to user
        const User = require('../models/User');
        await User.updateOne({ _id: req.user._id }, { $push: { purchases: order[0]._id } }).session(session);
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ orderId: order[0]._id, status: 'completed', totalAmount: total });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
}

module.exports = { getCart, postCart, deleteCartItem, checkout };
module.exports.putCart = async function putCart(req, res, next) {
    try {
        const items = req.body.items;
        if (!Array.isArray(items)) return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'items array required' } });
        const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items } }, { upsert: true, new: true });
        res.json(cart);
    } catch (err) { next(err); }
};
