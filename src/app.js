/* eslint-disable no-unused-vars */
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
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const buyOfferRoutes = require('./routes/buy-offer.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());

// Development logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/uploads', uploadRoutes);

app.use('/api/v1/buy-offers', buyOfferRoutes);

// Error Handler
app.use(errorHandler);

const PORT = config.PORT;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// CORS configuration
app.use(cors({
  origin: ['http://localhost:9000', 'http://localhost:5000'], // tambahkan domain HTTP yang diizinkan
  credentials: true
}));

app.use((req, res, next) => {
  req.secure = true; // Force treat all requests as secure
  next();
});

module.exports = app;