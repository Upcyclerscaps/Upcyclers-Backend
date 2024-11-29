/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */

const Collector = require('../models/collector.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getNearbyCollectors = catchAsync(async (req, res) => {
  const { longitude, latitude, radius = 10, categories } = req.query;

  if (!longitude || !latitude) {
    return next(new AppError('Please provide longitude and latitude', 400));
  }

  let query = {
    'serviceAreas.location': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    },
    isActive: true
  };

  if (categories) {
    query.acceptedCategories = { $in: categories.split(',') };
  }

  const collectors = await Collector.find(query)
    .populate('user', 'name phone profileImage rating');

  res.status(200).json({
    status: 'success',
    results: collectors.length,
    data: collectors
  });
});

exports.registerAsCollector = catchAsync(async (req, res) => {
  const existingCollector = await Collector.findOne({ user: req.user._id });
  
  if (existingCollector) {
    return next(new AppError('You are already registered as a collector', 400));
  }

  const collector = await Collector.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: collector
  });
});