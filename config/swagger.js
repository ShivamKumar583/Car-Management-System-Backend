const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger definition for the API documentation
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Car API',
    version: '1.0.0',
    description: 'API documentation for the Car CRUD API with user authentication',
  },
  servers: [
    {
      url: 'http://localhost:5000', // Replace with your server URL if deployed
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js', './controllers/*.js'], // Specify paths to your route/controller files
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Serve Swagger UI at /api/docs route
const setupSwagger = (app) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
