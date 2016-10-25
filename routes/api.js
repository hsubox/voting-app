var async = require('async');
var db = require('../models');
var bodyParser = require('body-parser');

module.exports = function(app, env) {

  app.post('/api/votes', function(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // randomize the ip to test app
    ip = Math.random();

    db.Vote.addVote(ip, req.params.choice_id, function(err, vote) {
      if (err) {
        res.send(err);
      } else {
        res.send(vote);
      }
    });
  });

  app.get('/votes/:choice_id', function(req, res) {

    db.Vote.findCount(req.params.choice_id, function(err, count) {
      if (err) {
        res.send(err);
      } else {
        res.send({ vote: count });
      }
    });
  });
};
