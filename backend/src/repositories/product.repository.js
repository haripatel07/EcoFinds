const Product = require('../models/Product');

async function findById(id, projection) { return Product.findById(id, projection); }
async function list(filter = {}, { page = 1, limit = 12, sort = '-createdAt' } = {}) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        Product.countDocuments(filter)
    ]);
    return { items, total, page, pages: Math.ceil(total / limit) };
}

module.exports = { findById, list };
