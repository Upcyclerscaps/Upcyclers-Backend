/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);

module.exports = router;