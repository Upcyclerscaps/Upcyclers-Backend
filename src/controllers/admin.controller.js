/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
// src/controllers/admin.controller.js
const User = require('../models/user.model');
const Product = require('../models/product.model');
const BuyOffer = require('../models/buy-offer.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getDashboardStats = catchAsync(async (req, res) => {
  try {
    // Get counts
    const [usersCount, productsCount, buyOffersCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      BuyOffer.countDocuments()
    ]);

    // Get latest items
    const [latestUsers, latestProducts] = await Promise.all([
      User.find().select('-password').limit(5).sort({ createdAt: -1 }),
      Product.find().limit(5).sort({ createdAt: -1 })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          usersCount,
          productsCount,
          buyOffersCount
        },
        latestUsers,
        latestProducts
      }
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error getting dashboard stats'
    });
  }
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    return next(new AppError('Error getting users', 500));
  }
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('-password');  // Exclude password field

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user
  });
});

exports.updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;

  // Validasi role
  if (!['user', 'admin'].includes(role)) {
    return next(new AppError('Invalid role', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: user
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Tambahkan flag untuk trigger logout
  res.status(200).json({
    status: 'success',
    data: user,
    requireLogout: true
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find()
    .populate('seller', 'name email profileImage')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: products
  });
});

exports.deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.getAllBuyOffers = catchAsync(async (req, res) => {
  const buyOffers = await BuyOffer.find()
    .populate('buyer', 'name email profileImage')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: buyOffers
  });
});

exports.deleteBuyOffer = catchAsync(async (req, res) => {
  const buyOffer = await BuyOffer.findByIdAndDelete(req.params.id);

  if (!buyOffer) {
    throw new AppError('Buy offer not found', 404);
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});