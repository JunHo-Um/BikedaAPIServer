var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var user = [{id: 1, name: 'junho'}];

  return res.json( user );
});

module.exports = router;
