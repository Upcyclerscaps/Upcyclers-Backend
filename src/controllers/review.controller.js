/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable space-before-function-paren */

const Review = require('../models/review.model');
const Transaction = require('../models/transaction.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
  const { transactionId, rating, comment } = req.body;

  // Verify transaction
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  // Verify transaction is completed
  if (transaction.status !== 'completed') {
    return next(new AppError('Can only review completed transactions', 400));
  }

  // Verify user is part of transaction
  if (![transaction.buyer.toString(), transaction.seller.toString()].includes(req.user.id)) {
    return next(new AppError('Not authorized to review this transaction', 403));
  }

  // Determine reviewee
  const reviewee = req.user.id === transaction.buyer.toString() 
    ? transaction.seller 
    : transaction.buyer;

  const review = await Review.create({
    transaction: transactionId,
    reviewer: req.user._id,
    reviewee,
    rating,
    comment
  });

  res.status(201).json({
    status: 'success',
    data: review
  });
});

exports.getUserReviews = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const reviews = await Review.find({ reviewee: userId })
    .populate('reviewer', 'name profileImage')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: reviews
  });
});