/* eslint-disable no-undef */
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const config = require('./config/config');
const connectDB = require('./config/database');
const routes = require('./routes/index');
const errorHandler = require('./middleware/error.handler');

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1', routes);

// Error Handler
app.use(errorHandler);

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;