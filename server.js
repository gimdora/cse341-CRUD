const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('./db/connect');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// basic middleware
app.use(cors());
app.use(express.json());

// session middleware (needed to keep the user logged in)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// github oauth strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
},
  (accessToken, refreshToken, profile, done) => {
    // just pass the github profile to the session
    return done(null, profile);
  }));

// save the user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// read the user back from the session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// routes
app.use('/', require('./routes'));

// global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// start the server only after db is connected
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and server is running on port ${port}`);
    });
  }
});