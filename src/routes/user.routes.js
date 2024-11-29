/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getProfile,
  updateProfile,
  getUserById
} = require('../controllers/user.controller');
const { uploadPhoto, resizePhoto } = require('../utils/file.handler');

router.get('/:id', getUserById);

router.use(protect);
router.get('/profile', getProfile);
router.patch('/profile', uploadPhoto, resizePhoto, updateProfile);

module.exports = router;