const express = require('express');
const reviews = require('../controllers/reviews.controller');

const router = express.Router();

router.route('/createReview').post(reviews.create);
router.route('/getReviewsByProduct/:id').get(reviews.getReviewsByProduct);

module.exports = router;