/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Upcyclers API Documentation',
      version: '1.0.0',
      description: 'API documentation untuk aplikasi Upcyclers'
    },
    servers: [
      {
        url: 'https://upcyclers.servehttp.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpecs = swaggerJsDoc(options);

module.exports = swaggerSpecs;