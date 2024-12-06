/* eslint-disable linebreak-style */
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

  // Create new user with default location
  const user = await User.create({
    username,
    email,
    password,
    name,
    phone,
    location: {
      type: 'Point',
      coordinates: [106.816666, -6.200000], // Default Jakarta coordinates
      address: '',
      radius: 5
    }
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
        name: user.name,
        location: user.location
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
        name: user.name,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        latitude: user.latitude,
        longitude: user.longitude,
        joinedAt: user.joinedAt
      }
    }
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  try {
    // Log data yang diterima
    console.log('Received update data:', req.body);

    const updateData = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode
    };

    if (req.body.profileImage) {
      updateData.profileImage = req.body.profileImage;
    }

    // Log data yang akan diupdate
    console.log('Updating user with data:', updateData);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return next(new AppError('User tidak ditemukan', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return next(new AppError(`Gagal mengupdate profil: ${error.message}`, 500));
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  req.user = user;
  next();
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        latitude: user.latitude,
        longitude: user.longitude,
        joinedAt: user.joinedAt
      }
    }
  });
});

exports.logout = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

module.exports = exports;