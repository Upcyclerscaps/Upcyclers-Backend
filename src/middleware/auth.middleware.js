/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */

jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get token and check if it exists
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Please log in to access this resource', 401));
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return next(new AppError('User no longer exists', 401));
    }

    // 4. Add user to request
    req.user = user;
    
    // Debug log
    console.log('Authenticated user:', {
      id: user._id,
      name: user.name,
      email: user.email
    });

    next();
  } catch (error) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
});