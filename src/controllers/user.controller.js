/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable space-before-function-paren */
/* eslint-disable arrow-parens */

const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.updateProfile = catchAsync(async (req, res, next) => {
  const updatableFields = ['name', 'phone', 'bio', 'location'];
  const updateData = {};

  updatableFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  if (req.file) {
    updateData.profileImage = `uploads/images/${req.file.filename}`;
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: user
  });
});

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Get user stats
  const userStats = await Promise.all([
    Product.countDocuments({ seller: user._id }),
    Transaction.countDocuments({ 
      $or: [{ seller: user._id }, { buyer: user._id }]
    }),
    Review.find({ reviewee: user._id }).select('rating')
  ]);

  const profileData = {
    ...user.toObject(),
    totalProducts: userStats[0],
    totalTransactions: userStats[1],
    reviews: userStats[2]
  };

  res.status(200).json({
    status: 'success',
    data: profileData
  });
});