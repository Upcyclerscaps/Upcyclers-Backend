/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const cloudinary = require('cloudinary').v2;
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = catchAsync(async (file) => {
  if (!file) throw new AppError('No file uploaded', 400);

  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'upcyclers',
    quality: 'auto',
    fetch_format: 'auto'
  });

  return {
    url: result.secure_url,
    publicId: result.public_id
  };
});

exports.deleteImage = catchAsync(async (publicId) => {
  if (!publicId) throw new AppError('No image ID provided', 400);

  const result = await cloudinary.uploader.destroy(publicId);
  return result;
});

exports.uploadMultipleImages = catchAsync(async (files) => {
  if (!files.length) throw new AppError('No files uploaded', 400);

  const uploadPromises = files.map((file) =>
    cloudinary.uploader.upload(file.path, {
      folder: 'upcyclers',
      quality: 'auto',
      fetch_format: 'auto'
    })
  );

  const results = await Promise.all(uploadPromises);
  return results.map((result) => ({
    url: result.secure_url,
    publicId: result.public_id
  }));
});