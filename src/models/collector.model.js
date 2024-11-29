/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const mongoose = require('mongoose');

const collectorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true
  },
  description: String,
  serviceAreas: [{
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      },
      address: String,
      radius: {
        type: Number, // in kilometers
        required: true
      }
    }
  }],
  acceptedCategories: [{
    type: String,
    enum: ['Logam', 'Plastik', 'Kertas', 'Elektronik']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
collectorSchema.index({ 'serviceAreas.location': '2dsphere' });

module.exports = mongoose.model('Collector', collectorSchema);