const Flag = require('../models/Flag');

async function flagProduct(req, res, next) {
    const { reason } = req.body;
    const item = await Flag.create({ product: req.params.id, reporter: req.user._id, reason });
    res.status(201).json(item);
}

async function listFlags(req, res, next) {
    const items = await Flag.find().populate('product reporter').lean();
    res.json(items);
}

module.exports = { flagProduct, listFlags };
