/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */

const Transaction = require('../models/transaction.model');
const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createTransaction = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  
  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  if (product.status !== 'available') {
    return next(new AppError('Product is not available', 400));
  }

  if (req.user.id === product.seller.toString()) {
    return next(new AppError('You cannot buy your own product', 400));
  }

  const transaction = await Transaction.create({
    product: productId,
    seller: product.seller,
    buyer: req.user._id,
    quantity,
    amount: product.price * parseFloat(quantity)
  });

  // Update product status
  await Product.findByIdAndUpdate(productId, { status: 'reserved' });

  res.status(201).json({
    status: 'success',
    data: transaction
  });
});

exports.updateTransactionStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const transaction = await Transaction.findById(id);
  
  if (!transaction) {
    return next(new AppError('Transaction not found', 404));
  }

  // Verify user is involved in transaction
  if (![transaction.seller.toString(), transaction.buyer.toString()].includes(req.user.id)) {
    return next(new AppError('You are not authorized to update this transaction', 403));
  }

  transaction.status = status;
  await transaction.save();

  // If transaction is completed or cancelled, update product status
  if (['completed', 'cancelled'].includes(status)) {
    await Product.findByIdAndUpdate(transaction.product, {
      status: status === 'completed' ? 'sold' : 'available'
    });
  }

  res.status(200).json({
    status: 'success',
    data: transaction
  });
});