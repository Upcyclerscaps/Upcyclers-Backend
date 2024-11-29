/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable space-before-function-paren */


const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required']
  }
}, {
  timestamps: true
});

// Mencegah duplicate reviews
reviewSchema.index({ transaction: 1, reviewer: 1 }, { unique: true });

// Update user rating setelah review baru
reviewSchema.statics.calcAverageRating = async function(userId) {
  const stats = await this.aggregate([
    {
      $match: { reviewee: userId }
    },
    {
      $group: {
        _id: '$reviewee',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(userId, {
      rating: stats[0].avgRating,
      totalReviews: stats[0].numReviews
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.reviewee);
});

module.exports = mongoose.model('Review', reviewSchema);