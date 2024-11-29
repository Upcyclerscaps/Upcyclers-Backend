/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');
const { uploadPhoto } = require('../utils/file.handler');

router.get('/', getAllProducts);
router.get('/:id', getProduct);

router.use(protect);
router.post('/', uploadPhoto, createProduct);
router.patch('/:id', uploadPhoto, updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;