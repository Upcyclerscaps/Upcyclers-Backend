/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */

const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { 
  register, 
  login,
  logout,
  getProfile,
  updateProfile 
} = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);

module.exports = router;