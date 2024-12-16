/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
// src/controllers/admin.controller.js
const User = require('../models/user.model');
const Product = require('../models/product.model');
const BuyOffer = require('../models/buy-offer.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getDashboardStats = catchAsync(async (req, res) => {
  const stats = {
    usersCount: await User.countDocuments(),
    productsCount: await Product.countDocuments({ status: 'available' }),
    buyOffersCount: await BuyOffer.countDocuments({ status: 'active' })
  };

  const [latestProducts, latestBuyOffers] = await Promise.all([
    Product.find().sort('-createdAt').limit(5).populate('seller', 'name'),
    BuyOffer.find().sort('-createdAt').limit(5).populate('buyer', 'name profileImage')
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      latestProducts,
      latestBuyOffers
    }
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find()
    .select('-password')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: users,
    pagination: {
      total: users.length,
      limit: 5
    }
  });
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