/* eslint-disable no-undef */
const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find()
    .populate('seller', 'name rating')
    .sort('-createdAt');

  const transformedProducts = products.map((product) => ({
    _id: product._id,
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    quantity: product.quantity,
    location: product.location,
    images: product.images,
    seller: product.seller,
    status: product.status,
    createdAt: product.createdAt
  }));

  res.status(200).json({
    status: 'success',
    data: transformedProducts
  });
});

exports.createProduct = catchAsync(async (req, res) => {
  // Add seller info from authenticated user
  req.body.seller = req.user._id;

  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: product
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'name profileImage phone');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({
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

exports.getUserProducts = catchAsync(async (req, res) => {
  // Debug log
  console.log('Getting products for user:', req.user._id);

  // Verify user authentication
  if (!req.user?._id) {
    throw new AppError('User not authenticated', 401);
  }

  try {
    const products = await Product.find({
      seller: req.user._id.toString() // Ensure proper type conversion
    })
      .sort('-createdAt');

    // Debug log
    console.log(`Found ${products.length} products`);

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products || []
    });
  } catch (error) {
    console.error('Error finding products:', error);
    throw new AppError('Error retrieving products', 500);
  }
});