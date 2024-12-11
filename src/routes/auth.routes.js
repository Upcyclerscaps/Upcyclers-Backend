/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  register, 
  login,
  logout,
  getProfile,
  updateProfile,
  updatePassword // Tambahkan ini
} = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.patch('/profile/password', protect, updatePassword);

module.exports = router;