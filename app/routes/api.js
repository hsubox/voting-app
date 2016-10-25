var async = require('async');
var db = require('../models');
var bodyParser = require('body-parser');

module.exports = function(app, env) {
  app.get('/api/polls', function(req, res) {
    db.Poll.findAll({
      // include: [{ model: db.Choice, as 'choices' }]
    }).success(function(polls) {
      res.send({
        polls: polls
      });
    });
  });

  app.get('/api/polls/:id', function(req, res) {
    db.Poll.find({
      where: { id: req.params.id },
      include: [{ model: db.Choice, as: 'choices' }]
    }).success(function(poll) {
      async.map(poll.choices, function(choice, callback) {
        db.Vote.findCount(choice.id, function(err, count) {
          choice.setDataValue('count', count);
          callback(err, choice);
        }, function(err, results) {
          poll.setDataValue('choices', results);
          res.send({
            poll: poll
          });
        });
      });
    });
  });

  app.post('/api/votes', function(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // randomize the ip to test app
    // ip = Math.random();

    var choice = req.body.vote.choice;

    db.Vote.addVote(ip, choice, function(err, vote) {
      if (err) {
        res.send(err);
      } else {
        res.send(vote);
      }
    });
  });

  app.get('/votes/:choiceId', function(req, res) {
    var choice = req.params.choiceId;

    db.Vote.findCount(choice, function(err, count) {
      if (err) {
        res.send(err);
      } else {
        res.send({ vote: count });
      }
    });
  });
};
