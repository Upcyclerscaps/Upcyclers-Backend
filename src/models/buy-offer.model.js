/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

const buyOfferSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Kategori harus diisi'],
    enum: ['Logam', 'Plastik', 'Kertas', 'Elektronik']
  },
  description: {
    type: String,
    required: [true, 'Deskripsi harus diisi']
  },
  amount: {
    value: {
      type: Number,
      required: [true, 'Jumlah harus diisi']
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'pcs']
    }
  },
  price: {
    amount: {
      type: Number,
      required: [true, 'Harga harus diisi']
    },
    negotiable: {
      type: Boolean,
      default: true
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: String
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create geospatial index
buyOfferSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('BuyOffer', buyOfferSchema);