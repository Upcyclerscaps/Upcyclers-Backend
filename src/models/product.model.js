/* eslint-disable camelcase */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Logam', 'Plastik', 'Kertas', 'Elektronik']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  stock: {
    amount: {
      type: Number,
      required: [true, 'Stock amount is required'],
      min: 0
    },
    unit: {
      type: String,
      required: [true, 'Stock unit is required'],
      enum: ['kg', 'pcs']
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String
  },
  images: [{
    url: {
      type: String,
      required: true
    },
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
  }
}, {
  timestamps: true
});

// Create geospatial index
productSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Product', productSchema);