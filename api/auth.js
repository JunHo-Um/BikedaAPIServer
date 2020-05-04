var express = require('express');
var router = express.Router();
var util = require('../util');
var jwt = require('jsonwebtoken');
var models = require('../models');

// 관리자 로그 인증 및 토큰생성
router.post('/admin', function( req, res, next ){
  var isValid = true;
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  if(!req.body.adminId){
    isValid = false;
    validationError.errors.adminId = {message:'아이디 미입력!'};
  }
  if(!req.body.adminPassword){
    isValid = false;
    validationError.errors.adminPassword = {message:'비밀번호 미입력!'};
  }
  if(!isValid) return res.json(util.successFalse(validationError));
  else next();
  },
  function( req,res,next ){
    var payload = {
      id : req.body.adminId
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }
);

// 지점 로그인 인증 및 토큰 생성
router.post('/branch', function( req, res, next ){
  var isValid = true;
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  var brcofcBsnsRgnmb = req.body.brcofcBsnsRgnmb  || '';
  var brcofcPassword  = req.body.brcofcPassword   || '';

  if( brcofcBsnsRgnmb.length < 1 ){
    isValid = false;
    validationError.errors.brcofcBsnsRgnmb = {message:'사업자 등록 번호 미입력!'};
  };

  if( brcofcPassword.length < 1 ){
    isValid = false;
    validationError.errors.brcofcPassword = {message:'비밀번호 미입력!'};
  };

  if(!isValid) return res.status(400).json(util.successFalse(validationError));
  else next();
  },
  function( req, res, next ){
    var brcofcBsnsRgnmb = req.body.brcofcBsnsRgnmb  || '';
    var brcofcPassword  = req.body.brcofcPassword   || '';
    console.log(brcofcPassword);
    models.branch_office.findOne({
      where : {
        brcofcBsnsRgnmb : brcofcBsnsRgnmb,
        brcofcPassword : brcofcPassword
      }
    }).then( result => {
      console.log( 'result' + result );
      var payload = {
        brcofcBsnsRgnmb : result.brcofcBsnsRgnmb
      };
      var secretOrPrivateKey = process.env.JWT_SECRET;
      console.log(secretOrPrivateKey);
      var options = {expiresIn: 60*60*24};
      jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
        if(err) return res.status(400).json(util.successFalse(err));
        res.status(200).json(util.successTrue(token));
      });
    }).catch( err => {
      return res.status(400).json( err );
    });

  }
);

// 상점 로그인 인증 및 토큰 생성
router.post('/store', function( req, res, next ){
  var isValid = true;
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  if(!req.body.stoBsnsRgnmb){
    isValid = false;
    validationError.errors.stoBsnsRgnmb = {message:'사업자 등록 번호 미입력!'};
  }
  if(!req.body.stoPassword){
    isValid = false;
    validationError.errors.stoPassword = {message:'비밀번호 미입력!'};
  }
  if(!isValid) return res.status(400).json(util.successFalse(validationError));
  else next();
  },
  function( req,res,next ){
    var payload = {
      stoBsnsRgnmb : req.body.stoBsnsRgnmb
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }
);

// 랴이더 로그인 인증 및 토큰 생성
router.post('/rider', function( req, res, next ){
  var isValid = true;
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  if(!req.body.riderCelno){
    isValid = false;
    validationError.errors.riderCelno = {message:'휴대폰 번호 미입력!'};
  }
  if(!isValid) return res.status(400).json(util.successFalse(validationError));
  else next();
  },
  function( req,res,next ){
    var payload = {
      riderCelno : req.body.riderCelno
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    var options = {expiresIn: 60*60*24};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }
);

// 관리자 인증 토큰 재생성
router.post('/refresh-admin', function( req, res, next ){
  var isValid = true;
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  if(!req.body.adminId){
    isValid = false;
    validationError.errors.adminId = {message:'아이디 미입력!'};
  }
  if(!isValid) return res.status(400).json(util.successFalse(validationError));
  else next();
  },
  function( req,res,next ){
    var payload = {
      adminId : req.body.adminId
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    // var options = {expiresIn: 60*60*24};
    var options = {expiresIn: 60};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }
);

// 지점 인증 토큰 재생성
router.post('/refresh-branch', function( req, res, next ){
  var isValid = true;
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  if(!req.body.brcofcBsnsRgnmb){
    isValid = false;
    validationError.errors.brcofcBsnsRgnmb = {message:'사업자 등록 번호 미입력!'};
  }
  if(!isValid) return res.status(400).json(util.successFalse(validationError));
  else next();
  },
  function( req,res,next ){
    var payload = {
      brcofcBsnsRgnmb : req.body.brcofcBsnsRgnmb
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    // var options = {expiresIn: 60*60*24};
    var options = {expiresIn: 60};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }
);

// 상점 인증 토큰 재생성
router.post('/refresh-store', function( req, res, next ){
  var isValid = true;
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  if(!req.body.stoBsnsRgnmb){
    isValid = false;
    validationError.errors.stoBsnsRgnmb = {message:'사업자 등록 번호 미입력!'};
  }
  if(!isValid) return res.status(400).json(util.successFalse(validationError));
  else next();
  },
  function( req,res,next ){
    var payload = {
      stoBsnsRgnmb : req.body.stoBsnsRgnmb
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    // var options = {expiresIn: 60*60*24};
    var options = {expiresIn: 60};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }
);

// 라이더 인증 토큰 재생성
router.post('/refresh-rider', function( req, res, next ){
  var isValid = true;
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  if(!req.body.riderCelno){
    isValid = false;
    validationError.errors.riderCelno = {message:'휴대폰 번호 미입력!'};
  }
  if(!isValid) return res.status(400).json(util.successFalse(validationError));
  else next();
  },
  function( req,res,next ){
    var payload = {
      riderCelno : req.body.riderCelno
    };
    var secretOrPrivateKey = process.env.JWT_SECRET;
    // var options = {expiresIn: 60*60*24};
    var options = {expiresIn: 60};
    jwt.sign(payload, secretOrPrivateKey, options, function(err, token){
      if(err) return res.status(400).json(util.successFalse(err));
      res.status(200).json(util.successTrue(token));
    });
  }
);
module.exports = router;
