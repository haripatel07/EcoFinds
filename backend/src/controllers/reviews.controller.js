const Review = require('../models/Review');

async function listReviews(req, res, next) {
    const items = await Review.find({ product: req.params.id }).lean();
    res.json(items);
}

async function createReview(req, res, next) {
    const { rating, comment } = req.body;
    const item = await Review.create({ product: req.params.id, buyer: req.user._id, rating, comment });
    res.status(201).json(item);
}

module.exports = { listReviews, createReview };
