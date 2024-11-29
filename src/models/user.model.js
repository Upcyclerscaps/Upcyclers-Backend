/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  phone: String,
  profileImage: String,
  coverImage: String,
  bio: String,
  location: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['user', 'collector', 'admin'],
    default: 'user'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password sebelum disimpan
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method untuk verifikasi password
userSchema.methods.checkPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);