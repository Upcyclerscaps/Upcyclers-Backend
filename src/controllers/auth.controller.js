/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */

const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { username, email, password, name, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return next(new AppError('Email or username already exists', 400));
  }

  const user = await User.create({
    username,
    email,
    password,
    name,
    phone
  });

  // Generate token
  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name
      }
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name
      }
    }
  });
});