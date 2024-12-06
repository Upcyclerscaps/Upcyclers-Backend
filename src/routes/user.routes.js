/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getProfile,
  updateProfile,
  findNearbySellers,
  findNearbyBuyers
} = require('../controllers/user.controller');

router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// Search routes
router.get('/nearby-sellers', findNearbySellers);
router.get('/nearby-buyers', findNearbyBuyers);

module.exports = router;