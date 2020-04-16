var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
require('dotenv').config();

// Bikeda branch index page Branch API Document
router.post('/branch-login', function( req, res, next ){
  var isValid = true;
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  if(!req.body.bsns_rgnmb){
    isValid = false;
    validationError.errors.bsns_rgnmb = {message:'사업자 등록 번호 미입력!'};
  }
  if(!req.body.password){
    isValid = false;
    validationError.errors.password = {message:'비밀번호 미입력!'};
  }
  if(!isValid) return res.json(util.successFalse(validationError));
  else next();
  },
  function(req,res,next){
    var payload = {
      bsns_rgnmb : req.body.bsns_rgnmb
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      console.log(err);
      if(err) return res.json(util.successFalse(err));
      res.json(util.successTrue(token));
    });
  }
);
module.exports = router;
