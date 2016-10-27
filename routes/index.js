var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  models.Poll.findAll({
    include: [ models.Choice ]
  }).then(function(polls) {
    res.render('index', {
      title: 'Polls',
      polls: polls
    });
  });
});

module.exports = router;
