/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createBuyOffer,
  getAllBuyOffers,
  getUserBuyOffers,
  getBuyOffer,
  updateBuyOffer,
  deleteBuyOffer
} = require('../controllers/buy-offer.controller');

// Protected routes
router.use(protect);

// User specific routes
router.get('/user', getUserBuyOffers);

// General routes
router.route('/')
  .get(getAllBuyOffers)
  .post(createBuyOffer);

router.route('/:id')
  .get(getBuyOffer)
  .patch(updateBuyOffer)
  .delete(deleteBuyOffer);

module.exports = router;