const Category = require('../models/Category');

async function listCategories(req, res, next) {
    try {
        const items = await Category.find().lean();
        res.json(items);
    } catch (err) { next(err); }
}

async function createCategory(req, res, next) {
    try {
        const { key, name } = req.body;
        if (!key || !name) {
            return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'key and name required' } });
        }
        const existing = await Category.findOne({ key });
        if (existing) {
            return res.status(409).json({ error: { code: 'CONFLICT', message: 'Category already exists' } });
        }
        const item = await Category.create({ key, name });
        res.status(201).json(item);
    } catch (err) { next(err); }
}

module.exports = { listCategories, createCategory };
