/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Logam', 'Plastik', 'Kertas', 'Elektronik']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  quantity: {
    type: String,
    required: [true, 'Quantity is required']
  },
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
    address: String
  },
  images: [{
    url: String,
    is_primary: {
      type: Boolean,
      default: false
    }
  }],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  condition: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', productSchema);