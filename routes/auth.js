require('dotenv').config();
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var express = require('express');
var router = express.Router();
var models = require('../models');

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    models.User.findOrCreate({
      where: {
        twitterId: profile.id
      },
      defaults: {
        twitterId: profile.id,
        twitterDisplayName: profile.displayName
      }
    }).spread(function(user, created) {
      done(null, user);
    }).catch(function(err) {
      done(err);
    });
  }
));

router.get('/twitter', passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/' }));

module.exports = router;
