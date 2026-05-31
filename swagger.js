const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Books API',
    description: 'CRUD API for books and reviews. GET routes are public. POST, PUT, and DELETE routes for both books and reviews are protected and require GitHub OAuth login.'
  },
  host: process.env.HOST || 'localhost:3000',
  schemes: ['https', 'http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);