/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const Category = require('../models/category.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find();
  
  res.status(200).json({
    status: 'success',
    data: categories
  });
});

exports.createCategory = catchAsync(async (req, res) => {
  const category = await Category.create(req.body);

  res.status(201).json({
    status: 'success',
    data: category
  });
});