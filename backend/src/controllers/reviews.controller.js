const Review = require('../models/Review');

async function listReviews(req, res, next) {
    try {
        const items = await Review.find({ product: req.params.id })
            .populate('buyer', 'username')
            .lean();
        res.json(items);
    } catch (err) { next(err); }
}

async function createReview(req, res, next) {
    try {
        const { rating, comment } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Rating must be 1-5' } });
        }
        const item = await Review.create({
            product: req.params.id,
            buyer: req.user._id,
            rating,
            comment
        });
        res.status(201).json(item);
    } catch (err) { next(err); }
}

module.exports = { listReviews, createReview };
