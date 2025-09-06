const Product = require('../models/Product');
const { parsePagination } = require('../utils/pagination');

async function listProducts(req, res, next) {
    const { q, category } = req.query;
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { available: true };
    if (category) filter.category = category;
    let items;
    if (q) {
        // try text search first
        items = await Product.find({ ...filter, $text: { $search: q } })
            .skip(skip).limit(limit).lean();
    } else {
        items = await Product.find(filter).skip(skip).limit(limit).lean();
    }
    const total = await Product.countDocuments(filter);
    res.json({ items, page, limit, total });
}

async function getProduct(req, res, next) {
    const p = await Product.findById(req.params.id).populate('seller', 'username avatarUrl').lean();
    if (!p) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });
    res.json(p);
}

async function createProduct(req, res, next) {
    const body = req.body;
    const product = await Product.create({ ...body, seller: req.user._id });
    res.status(201).json(product);
}

async function updateProduct(req, res, next) {
    const product = req.product; // set by ownership middleware
    Object.assign(product, req.body);
    product.updatedAt = Date.now();
    await product.save();
    res.json(product);
}

async function deleteProduct(req, res, next) {
    await req.product.deleteOne();
    res.status(204).send();
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
