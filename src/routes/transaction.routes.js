/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createTransaction,
  updateTransactionStatus
} = require('../controllers/transaction.controller');

router.use(protect);
router.post('/', createTransaction);
router.patch('/:id/status', updateTransactionStatus);

module.exports = router;