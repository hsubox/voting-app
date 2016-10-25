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

router.get('/css/:css', function (req, res) {
    res.sendFile(process.cwd() + '/css/' + req.params.css);
});

module.exports = router;
