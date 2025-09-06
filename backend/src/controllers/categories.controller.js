const Category = require('../models/Category');

async function listCategories(req, res, next) {
    const items = await Category.find().lean();
    res.json(items);
}

async function createCategory(req, res, next) {
    const item = await Category.create(req.body);
    res.status(201).json(item);
}

module.exports = { listCategories, createCategory };
