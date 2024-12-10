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

// Protected routes
router.use(protect);
router.get('/user', getUserProducts);  // Pindahkan ke atas sebelum route dengan parameter
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

module.exports = router;