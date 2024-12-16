/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */

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
  console.log('Get buy offers request:', req.query);

  const { longitude, latitude, radius = 5, category } = req.query;

  let query = {};

  if (longitude && latitude) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(radius) * 1000
      }
    };
  }

  if (category) {
    query.category = category;
  }

  console.log('MongoDB query:', JSON.stringify(query, null, 2));

  const buyOffers = await BuyOffer.find(query)
    .populate('buyer', 'name phone')
    .sort('-createdAt');

  console.log('Found buy offers:', buyOffers);

  // Force new response
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

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

  // Pastikan ada data lokasi
  if (!req.body.location || !req.body.location.coordinates) {
    req.body.location = {
      type: 'Point',
      coordinates: [106.816666, -6.200000], // Default Jakarta jika tidak ada koordinat
      address: req.body.location?.address || ''
    };
  }

  const buyOffer = await BuyOffer.create(req.body);

  res.status(201).json({
    status: 'success',
    data: buyOffer
  });
});

exports.updateBuyOffer = catchAsync(async (req, res, next) => {
  // Update data location jika ada
  if (req.body.location && !req.body.location.type) {
    req.body.location = {
      type: 'Point',
      coordinates: req.body.location.coordinates || [106.816666, -6.200000],
      address: req.body.location.address || ''
    };
  }

  const buyOffer = await BuyOffer.findOneAndUpdate(
    {
      _id: req.params.id,
      buyer: req.user._id
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