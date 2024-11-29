/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getAllCategories,
  createCategory
} = require('../controllers/category.controller');

router.get('/', getAllCategories);
router.post('/', protect, createCategory);

module.exports = router;