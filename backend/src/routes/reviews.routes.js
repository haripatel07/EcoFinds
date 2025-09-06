const express = require('express');
const router = express.Router({ mergeParams: true });
const { listReviews, createReview } = require('../controllers/reviews.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { reviewCreate } = require('../utils/validators');

router.get('/', listReviews);
router.post('/', auth, reviewCreate, validate, createReview);

module.exports = router;
