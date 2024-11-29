/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */

const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllProducts = catchAsync(async (req, res) => {
  const { category, location, minPrice, maxPrice, search } = req.query;

  const query = {};

  if (category) {
    query.category = category;
  }

  if (location) {
    query['location.address'] = { $regex: location, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const products = await Product.find(query)
    .populate('seller', 'name rating')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'name rating phone');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

exports.createProduct = catchAsync(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    seller: req.user._id
  });

  res.status(201).json({
    status: 'success',
    data: product
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    return next(new AppError('Product not found or unauthorized', 404));
  }

  res.status(200).json({
    status: 'success',
    data: product
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    seller: req.user._id
  });

  if (!product) {
    return next(new AppError('Product not found or unauthorized', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});