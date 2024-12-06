/* eslint-disable linebreak-style */

const AppError = require('../utils/appError');
const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
  console.error('Detailed error:', {
    message: err.message,
    stack: err.stack,
    details: err
  });

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
};

module.exports = errorHandler;