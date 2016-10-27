var sequelize = require('sequelize');
var Sequelize = require('Sequelize');
var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.redirect('/');
});

router.get('/create', function (req, res) {
  res.render('create_poll', {
    title: 'Create a new poll'
  });
});

router.post('/create', function (req, res) {
    models.Poll.create({
      question: req.body.question
    }).then(function(poll) {
      res.redirect('/polls/' + poll.id + '/edit');
    });
});

router.get('/:poll_id/edit', function(req, res) {
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
      poll: poll
    });
  });
});

router.get('/:poll_id/show', function(req, res) {
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
      poll: poll
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

router.get('/:poll_id/destroy', function(req, res) {
    models.Poll.destroy({
      where: {
        id: req.params.poll_id
      }
    }).then(function() {
      res.redirect('/');
    });
});

router.post('/:poll_id/choice/create', function(req, res) {
  models.Choice.create({
    option: req.body.option,
    PollId: req.params.poll_id
  }).then(function() {
    res.redirect('/polls/' + req.params.poll_id + '/edit');
  });
});

router.get('/:poll_id/choice/:choice_id/destroy', function(req, res) {
  models.Choice.destroy({
    where: {
      id: req.params.choice_id
    }
  }).then(function() {
    res.redirect('/polls/' + req.params.poll_id + '/show');
  });
});

router.post('/:poll_id/choice/:choice_id/vote', function(req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  // randomize the ip to test app
  var ip = Math.random();

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
        res.redirect("/polls/" + req.params.poll_id + "/show");
      });
    } else {
      res.send("Error: You have already voted!");
    }
  });
});

module.exports = router;
