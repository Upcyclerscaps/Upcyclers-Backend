/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.updateProfile = catchAsync(async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true
  });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
});

exports.getUserProfile = catchAsync(async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
});

exports.updatePassword = catchAsync(async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!(await user.checkPassword(currentPassword))) {
    throw new AppError('Current password is incorrect', 401);
  }
  user.password = newPassword;
  await user.save();
  return user;
});