/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const AppError = require('../utils/appError');

exports.checkAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new AppError('Unauthorized: Admin access required', 403));
  }
  next();
};