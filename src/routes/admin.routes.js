/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const checkRole = require('../middleware/check-role.middleware');
const adminController = require('../controllers/admin.controller');

// Protect all admin routes
router.use(protect);
router.use(checkRole(['admin']));

// User Management
router.get('/users', adminController.getAllUsers); // Endpoint untuk list users
router.get('/users/:id', adminController.getUser); // Endpoint untuk single user
router.patch('/users/:id', adminController.updateUser);
router.patch('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Dashboard
router.get('/dashboard-stats', adminController.getDashboardStats);

// Products Management
router.get('/products', adminController.getAllProducts);
router.delete('/products/:id', adminController.deleteProduct);

// Buy Offers Management
router.get('/buy-offers', adminController.getAllBuyOffers);
router.delete('/buy-offers/:id', adminController.deleteBuyOffer);

module.exports = router;