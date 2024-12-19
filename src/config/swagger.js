/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Upcyclers API Documentation',
      version: '1.0.0',
      description: 'API documentation untuk aplikasi Upcyclers',
      contact: {
        name: 'Admin Upcyclers',
        email: 'admin@upcyclers.com'
      },
    },
    servers: [
      {
        url: 'https://upcyclers.servehttp.com/api/v1',
        description: 'Development server'
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
  apis: ['./src/routes/*.js'] // path ke file route
};

const swaggerSpecs = swaggerJsDoc(options);

module.exports = swaggerSpecs;