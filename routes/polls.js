var sequelize = require('sequelize');
var models = require('../models');
var express = require('express');
var router = express.Router();
var isAuthenticated = require('./isAuthenticated');
var hasPermissions = require('./hasPermissions');

router.get('/', isAuthenticated, function(req, res) {
  models.Poll.findAll({
    include: [ models.Choice ]
  }).then(function(polls) {
    res.render('index', {
      title: 'Polls',
      polls: polls,
      user: req.user.twitterDisplayName,
      flash_message: req.flash()
    });
  });
});

router.get('/create', hasPermissions, function (req, res) {
  res.render('create_poll', {
    title: 'Create a new poll',
    user: req.user.twitterDisplayName,
    flash_message: req.flash()
  });
});

router.post('/create', hasPermissions, function (req, res) {
    models.Poll.create({
      question: req.body.question
    }).then(function(poll) {
      res.redirect('/polls/' + poll.id + '/edit');
    });
});

router.get('/:poll_id/edit', hasPermissions, function(req, res) {
  models.Poll.find({
    where: {
      id: req.params.poll_id
    },
    include: [{
      model: models.Choice,
      include: [{
        model: models.Vote,
        //attributes: [[sequelize.fn('COUNT', sequelize.col('ChoiceId')), 'no_votes']]
      }]
    }]
  }).then(function(poll) {
    res.render('edit_poll', {
      poll: poll,
      user: req.user.twitterDisplayName,
      flash_message: req.flash()
    });
  });
});

router.get('/:poll_id/show', isAuthenticated, function(req, res) {
  models.Poll.find({
    where: {
      id: req.params.poll_id
    },
    include: [{
      model: models.Choice,
      include: [{
        model: models.Vote,
        //attributes: [[sequelize.fn('COUNT', sequelize.col('ChoiceId')), 'no_votes']]
      }]
    }]
  }).then(function(poll) {
    res.render('show_poll', {
      poll: poll,
      user: req.user.twitterDisplayName,
      flash_message: req.flash()
    });
  });
});

router.get('/:poll_id/json', function(req, res) {
  models.Poll.find({
    where: {
      id: req.params.poll_id
    },
    include: [{
      model: models.Choice,
      include: [{
        model: models.Vote,
        //attributes: [[sequelize.fn('COUNT', sequelize.col('ChoiceId')), 'no_votes']]
      }]
    }]
  }).then(function(poll) {
    res.send({
      poll: poll
    });
  });
});

router.get('/:poll_id/destroy', hasPermissions, function(req, res) {
    models.Poll.destroy({
      where: {
        id: req.params.poll_id
      }
    }).then(function() {
      res.redirect('/');
    });
});

router.post('/:poll_id/choice/create', hasPermissions, function(req, res) {
  models.Choice.create({
    option: req.body.option,
    PollId: req.params.poll_id
  }).then(function() {
    res.redirect('/polls/' + req.params.poll_id + '/edit');
  });
});

router.get('/:poll_id/choice/:choice_id/destroy', hasPermissions, function(req, res) {
  models.Choice.destroy({
    where: {
      id: req.params.choice_id
    }
  }).then(function() {
    res.redirect('/polls/' + req.params.poll_id + '/edit');
  });
});

router.post('/:poll_id/choice/:choice_id/vote', isAuthenticated, function(req, res) {
  var ip = req.user.twitterDisplayName || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // randomize the ip to test app
  // var ip = Math.random();

  models.Vote.findAll({
    where: {
      ip: ip,
      ChoiceId: req.params.choice_id
    }
  }).then(function(votes) {
    if (!votes || votes.length === 0) {
      models.Vote.create({
        ip: ip,
        ChoiceId: req.params.choice_id
      }).then(function(vote) {
        req.flash("info", "Thanks for voting!");
        res.redirect("/polls/" + req.params.poll_id + "/show");
      });
    } else {
      req.flash("error", "You have already voted!");
      res.redirect("/polls/" + req.params.poll_id + "/show");
    }
  });
});

module.exports = router;
