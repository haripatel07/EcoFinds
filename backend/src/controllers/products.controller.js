const Product = require('../models/Product');
const { parsePagination } = require('../utils/pagination');

async function listProducts(req, res, next) {
    try {
        const { q, category } = req.query;
        const { page, limit, skip } = parsePagination(req.query);

        const filter = { available: true };
        if (category) filter.category = category;

        let items;
        if (q) {
            items = await Product.find({ ...filter, $text: { $search: q } })
                .skip(skip)
                .limit(limit)
                .lean();
        } else {
            items = await Product.find(filter).skip(skip).limit(limit).lean();
        }

        const total = await Product.countDocuments(filter);
        res.json({ items, page, limit, total });
    } catch (err) { next(err); }
}

async function getProduct(req, res, next) {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'username avatarUrl')
            .lean();
        if (!product) {
            return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Product not found' } });
        }
        res.json(product);
    } catch (err) { next(err); }
}

async function createProduct(req, res, next) {
    try {
        const { title, description, category, price, images, condition, location } = req.body;
        if (!title || !price) {
            return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'title and price required' } });
        }
        const product = await Product.create({
            title,
            description,
            category,
            price,
            images,
            condition,
            location,
            seller: req.user._id
        });
        res.status(201).json(product);
    } catch (err) { next(err); }
}

async function updateProduct(req, res, next) {
    try {
        const product = req.product; // set by ownership middleware
        Object.assign(product, req.body);
        product.updatedAt = Date.now();
        await product.save();
        res.json(product);
    } catch (err) { next(err); }
}

async function deleteProduct(req, res, next) {
    try {
        await req.product.deleteOne();
        res.status(204).send();
    } catch (err) { next(err); }
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
