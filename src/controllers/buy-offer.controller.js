/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const BuyOffer = require('../models/buy-offer.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUserBuyOffers = catchAsync(async (req, res, next) => {
  console.log('Getting buy offers for user:', req.user._id); // Debug log

  const buyOffers = await BuyOffer.find({
    buyer: req.user._id
  }).sort('-createdAt');

  console.log('Found buy offers:', buyOffers); // Debug log

  res.status(200).json({
    status: 'success',
    data: buyOffers
  });
});

exports.getAllBuyOffers = catchAsync(async (req, res) => {
  const buyOffers = await BuyOffer.find().sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: buyOffers
  });
});

exports.getBuyOffer = catchAsync(async (req, res, next) => {
  const buyOffer = await BuyOffer.findById(req.params.id);

  if (!buyOffer) {
    return next(new AppError('No buy offer found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: buyOffer
  });
});

exports.createBuyOffer = catchAsync(async (req, res) => {
  // Add buyer info from authenticated user
  req.body.buyer = req.user._id;

  const buyOffer = await BuyOffer.create(req.body);

  res.status(201).json({
    status: 'success',
    data: buyOffer
  });
});

exports.updateBuyOffer = catchAsync(async (req, res, next) => {
  const buyOffer = await BuyOffer.findOneAndUpdate(
    {
      _id: req.params.id,
      buyer: req.user._id // Only allow update if user is the buyer
    },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!buyOffer) {
    return next(new AppError('No buy offer found with that ID or not authorized', 404));
  }

  res.status(200).json({
    status: 'success',
    data: buyOffer
  });
});

exports.deleteBuyOffer = catchAsync(async (req, res, next) => {
  const buyOffer = await BuyOffer.findOneAndDelete({
    _id: req.params.id,
    buyer: req.user._id // Only allow deletion if user is the buyer
  });

  if (!buyOffer) {
    return next(new AppError('No buy offer found with that ID or not authorized', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});