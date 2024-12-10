/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const AppError = require('../utils/appError');

exports.validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    next();
  };
};

exports.validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    next();
  };
};

exports.validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    next();
  };
};