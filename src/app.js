/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
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
  origin: ['https://upcyclers.zapto.org', 'https://localhost:5000'], // Update to allow your frontend domain
  credentials: true
}));

// Force all requests to be secure (for HTTPS redirection)
app.use((req, res, next) => {
  req.secure = true; // Force treat all requests as secure
  req.secure = true; // Mark all requests as secure
  next();
});

module.exports = app;
// Read SSL certificate and key for HTTPS
const sslOptions = {
  cert: fs.readFileSync('/etc/letsencrypt/live/upcyclers.zapto.org/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/upcyclers.zapto.org/privkey.pem'),
};
// Start HTTPS server
const PORT = config.PORT || 5000;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Backend server is running on https://upcyclers.zapto.org:${PORT}`);
});
module.exports = app;