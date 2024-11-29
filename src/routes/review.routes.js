/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable space-before-function-paren */
/* eslint-disable arrow-parens */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { 
  createReview,
  getUserReviews
} = require('../controllers/review.controller');

const router = express.Router();

router.use(protect);

router.post('/', createReview);
router.get('/user/:userId', getUserReviews);

module.exports = router;