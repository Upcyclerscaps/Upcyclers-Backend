/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
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
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'https://upcyclers.servehttp.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());

// Development logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
const apiRouter = express.Router();
apiRouter.use('/auth', authRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/uploads', uploadRoutes);
apiRouter.use('/buy-offers', buyOfferRoutes);
apiRouter.use('/admin', adminRoutes);

// Mount API router
app.use('/api/v1', apiRouter);

// Swagger documentation route
if (config.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
}

// Error Handler
app.use(errorHandler);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start server
if (require.main === module) {
  const PORT = config.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
