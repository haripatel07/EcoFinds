const Flag = require('../models/Flag');

async function flagProduct(req, res, next) {
    try {
        const { reason } = req.body;
        if (!reason) {
            return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'reason required' } });
        }
        const item = await Flag.create({
            product: req.params.id,
            reporter: req.user._id,
            reason
        });
        res.status(201).json(item);
    } catch (err) { next(err); }
}

async function listFlags(req, res, next) {
    try {
        const items = await Flag.find()
            .populate('product reporter', 'title username email')
            .lean();
        res.json(items);
    } catch (err) { next(err); }
}

module.exports = { flagProduct, listFlags };
