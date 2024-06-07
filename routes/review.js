const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const Review = require('../models/review');
const ExpressError = require("../utils/ExpressError");
const { validateReview, isReviewAuthor } = require("../middleware.js");
const router = express.Router({ mergeParams: true });
const {isLoggedIn} = require("../middleware.js")
const reviewController= require("../controllers/reviews.js");

router.post('/', isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


router.delete('/:reviewId', isLoggedIn ,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
