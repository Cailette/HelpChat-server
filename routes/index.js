var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send({"API" : "HelpChat REST API is Working..."});
});

module.exports = router;
