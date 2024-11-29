/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const collectorRoutes = require('./collector.routes');
const transactionRoutes = require('./transaction.routes');
const categoryRoutes = require('./category.routes');
const reviewRoutes = require('./review.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/collectors', collectorRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;