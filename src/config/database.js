/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable space-before-function-paren */

const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
 try {
   await mongoose.connect(config.MONGODB_URI);
   console.log('MongoDB Connected');
 } catch (error) {
   console.error('MongoDB connection error:', error);
   process.exit(1);
 }
};

module.exports = connectDB;