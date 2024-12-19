/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password harus diisi'],
    minlength: [8, 'Password minimal 8 karakter'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Nama minimal 3 karakter']
  },
  phone: String,
  profileImage: String,
  address: String,
  city: String,
  postalCode: String,
  latitude: {
    type: Number,
    required: false
  },
  longitude: {
    type: Number,
    required: false
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [106.816666, -6.200000]  // Default ke Jakarta
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index untuk query geospatial
userSchema.index({ location: '2dsphere' });

// Middleware untuk hash password sebelum save
userSchema.pre('save', async function (next) {
  // Hanya hash password jika password dimodifikasi
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);

    // Update location jika ada lat/long
    if (this.latitude && this.longitude) {
      this.location = {
        type: 'Point',
        coordinates: [this.longitude, this.latitude]
      };
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Middleware untuk update pada method findOneAndUpdate
userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.latitude && update.longitude) {
    this.set({
      location: {
        type: 'Point',
        coordinates: [update.longitude, update.latitude]
      }
    });
  }
  next();
});

// Method untuk verifikasi password
userSchema.methods.checkPassword = async function (candidatePassword) {
  if (!this.password) return false;

  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error('Password check error:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);