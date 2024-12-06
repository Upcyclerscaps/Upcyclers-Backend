/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = catchAsync(async (userData) => {
  const user = await User.create(userData);
  const token = signToken(user._id);
  return { user, token };
});

exports.login = catchAsync(async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.checkPassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  const token = signToken(user._id);
  return { user, token };
});

exports.protect = catchAsync(async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('Invalid token', 401);
  }
  return user;
});