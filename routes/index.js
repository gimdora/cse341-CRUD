const express = require('express');
const router = express.Router();
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

// swagger docs
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// root route, shows if you are logged in or not
router.get('/', (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Home route, shows login status'
  if (req.isAuthenticated()) {
    res.send(`Logged in as ${req.user.username}. Go to /api-docs for the documentation.`);
  } else {
    res.send('Logged out. Go to /login to log in, or /api-docs for the documentation.');
  }
});

// start the github login
router.get('/login', passport.authenticate('github'), (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Log in with GitHub'
});

// github sends the user back here after login
router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/api-docs'
}), (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'GitHub OAuth callback'
  res.redirect('/');
});

// log out and clear the session
router.get('/logout', (req, res, next) => {
  // #swagger.tags = ['Auth']
  // #swagger.summary = 'Log out'
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// resource routes
router.use('/books', require('./books'));
router.use('/reviews', require('./reviews'));

module.exports = router;