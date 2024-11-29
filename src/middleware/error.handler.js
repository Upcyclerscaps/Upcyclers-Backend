/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */

const AppError = require('../utils/appError');
const config = require('../config/config');

const errorHandler = (err, req, res, next) => {
 err.statusCode = err.statusCode || 500;
 err.status = err.status || 'error';

 if (config.NODE_ENV === 'development') {
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