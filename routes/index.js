const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// swagger docs
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// resource routes
router.use('/books', require('./books'));
router.use('/reviews', require('./reviews'));

// root route
router.get('/', (req, res) => {
  res.send('Books API. Go to /api-docs to see the documentation.');
});

module.exports = router;
