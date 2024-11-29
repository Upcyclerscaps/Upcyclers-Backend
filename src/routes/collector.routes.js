/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getNearbyCollectors,
  registerAsCollector
} = require('../controllers/collector.controller');

router.get('/nearby', getNearbyCollectors);
router.post('/register', protect, registerAsCollector);

module.exports = router;