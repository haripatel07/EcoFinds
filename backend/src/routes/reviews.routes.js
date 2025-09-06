const express = require('express');
const router = express.Router({ mergeParams: true });

const {
  listReviews,
  createReview,
} = require('../controllers/reviews.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { reviewCreate } = require('../utils/validators');

// List reviews for product
router.get('/', listReviews);

// Add review to product
router.post('/', auth, reviewCreate, validate, createReview);

module.exports = router;
