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
  deleteProduct,
  getUserProducts
} = require('../controllers/product.controller');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Protected routes - harus login
router.use(protect);

router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/user', getUserProducts); // Route untuk mendapatkan produk user

module.exports = router;