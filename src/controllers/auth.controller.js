/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = catchAsync(async (req, res, next) => {
  try {
    // Check if email exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return next(new AppError('Email sudah terdaftar', 400));
    }

    // Create user
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    user.password = undefined;

    res.status(201).json({
      status: 'success',
      message: 'Registrasi berhasil',
      data: { user }
    });

  } catch (error) {
    // Handle MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(new AppError(`${field} sudah digunakan`, 400));
    }

    return next(new AppError('Gagal melakukan registrasi', 500));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Email dan password harus diisi', 400));
    }

    // Find user by email with password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      console.log('User not found');
      return next(new AppError('Email atau password salah', 401));
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log('Password check result:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      return next(new AppError('Email atau password salah', 401));
    }

    // Generate token
    const token = signToken(user._id);

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return next(new AppError('Gagal melakukan login', 500));
  }
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  try {
    const updateData = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode
    };

    // Add profileImage if provided
    if (req.body.profileImage) {
      updateData.profileImage = req.body.profileImage;
      console.log('Updating profile image:', req.body.profileImage); // Debug log
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return next(new AppError('User tidak ditemukan', 404));
    }

    // Verify update was successful
    console.log('Updated user:', updatedUser); // Debug log

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return next(new AppError(`Gagal mengupdate profil: ${error.message}`, 500));
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  req.user = user;
  next();
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        phone: user.phone,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        latitude: user.latitude,
        longitude: user.longitude,
        joinedAt: user.joinedAt
      }
    }
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  try {
    // Get user
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return next(new AppError('User tidak ditemukan', 404));
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return next(new AppError('Password saat ini tidak sesuai', 401));
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Password berhasil diubah'
    });

  } catch (error) {
    console.error('Password update error:', error);
    return next(new AppError('Gagal mengubah password', 500));
  }
});

exports.logout = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

module.exports = exports;