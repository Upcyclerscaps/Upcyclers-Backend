const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const https = require('https');
const fs = require('fs');
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

// CORS configuration
app.use(cors({
  origin: ['https://upcyclers.myvnc.com', 'https://localhost:5000'], // Update to allow your frontend domain
  credentials: true
}));

// Force all requests to be secure (for HTTPS redirection)
app.use((req, res, next) => {
  req.secure = true; // Mark all requests as secure
  next();
});

// Read SSL certificate and key for HTTPS
const sslOptions = {
  cert: fs.readFileSync('/etc/letsencrypt/live/upcyclers.myvnc.com/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/upcyclers.myvnc.com/privkey.pem'),
};

// Start HTTPS server
const PORT = config.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Backend server is running on https://upcyclers.myvnc.com:${PORT}`);
});

module.exports = app;
