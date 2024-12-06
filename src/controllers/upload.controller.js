/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable no-undef */
const cloudinary = require('../utils/cloudinary');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.uploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'products',
      transformation: [{
        width: 1000,
        height: 1000,
        crop: 'limit'
      }]
    });

    res.status(200).json({
      status: 'success',
      data: {
        url: result.secure_url,
        public_id: result.public_id
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    throw new AppError('Failed to upload image', 500);
  }
});

exports.deleteImage = catchAsync(async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    throw new AppError('No image ID provided', 400);
  }

  try {
    // Delete image from cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully',
      result
    });

  } catch (error) {
    console.error('Delete error:', error);
    throw new AppError(`Failed to delete image. ${  error.message}`, 500);
  }
});

module.exports = exports;