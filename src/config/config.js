/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */

require('dotenv').config();

const config = {
 PORT: process.env.PORT || 5000,
 MONGODB_URI: process.env.MONGODB_URI,
 JWT_SECRET: process.env.JWT_SECRET,
 JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
 NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = config;