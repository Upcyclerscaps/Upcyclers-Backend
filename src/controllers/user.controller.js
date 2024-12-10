/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const User = require('../models/user.model');
const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');
const ItemService = require('../services/item.service');

exports.getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id);

  // Get user stats (hanya products)
  const products = await Product.countDocuments({ seller: user._id });

  res.status(200).json({
    status: 'success',
    data: {
      ...user.toObject(),
      totalProducts: products
    }
  });
});

exports.updateProfile = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: updatedUser
  });
});

exports.getUserProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ seller: req.user._id })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: products
  });
});

exports.addSellItem = catchAsync(async (req, res) => {
  const item = await ItemService.addSellItem(req.user._id, req.body);

  res.status(201).json({
    status: 'success',
    data: item
  });
});

exports.addBuyItem = catchAsync(async (req, res) => {
  const item = await ItemService.addBuyItem(req.user._id, req.body);

  res.status(201).json({
    status: 'success',
    data: item
  });
});

exports.updateSellItemStock = catchAsync(async (req, res) => {
  const item = await ItemService.updateSellItemStock(
    req.user._id,
    req.params.itemId,
    req.body.stock
  );

  res.status(200).json({
    status: 'success',
    data: item
  });
});

exports.updateBuyItemAmount = catchAsync(async (req, res) => {
  const item = await ItemService.updateBuyItemAmount(
    req.user._id,
    req.params.itemId,
    req.body.amount
  );

  res.status(200).json({
    status: 'success',
    data: item
  });
});

exports.findNearbySellers = catchAsync(async (req, res) => {
  const { longitude, latitude, category, radius = 5 } = req.query;

  const products = await Product.find({
    status: 'available',
    ...(category && { category }),
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(radius) * 1000
      }
    }
  }).populate('seller', 'name phone');

  res.status(200).json({
    status: 'success',
    data: products
  });
});

exports.findNearbyBuyers = catchAsync(async (req, res) => {
  const { longitude, latitude, category, radius = 5 } = req.query;

  const buyOffers = await BuyOffer.find({
    status: 'active',
    ...(category && { category }),
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        $maxDistance: parseInt(radius) * 1000
      }
    }
  }).populate('buyer', 'name phone');

  res.status(200).json({
    status: 'success',
    data: buyOffers
  });
});

exports.findNearbyBuyers = catchAsync(async (req, res) => {
  const { longitude, latitude, category, radius = 5 } = req.query;

  // Validasi input
  if (!longitude || !latitude) {
    throw new AppError('Koordinat lokasi diperlukan', 400);
  }

  const coordinates = [
    parseFloat(longitude),
    parseFloat(latitude)
  ];

  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: parseInt(radius) * 1000 // Convert to meters
      }
    }
  };

  // Tambahkan filter kategori jika ada
  if (category) {
    query.category = category;
  }

  const buyers = await User.find(query)
    .select('name location phone');

  res.status(200).json({
    status: 'success',
    results: buyers.length,
    data: buyers
  });
});