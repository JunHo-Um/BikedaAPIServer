var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');

// 바이크다 지점 API Document
router.get('/', function( req, res, next ) {
  res.render('branch', { title: '바이크다 지점 API' });
});

// 바이크다 지점 전체 목록
router.get('/branches', util.isLoggedin, function( req, res, next ) {
  models.tb_branch_office.findAll().then( result => {
    return res.status(200).json( result );
  }).catch( err => {
    return res.status(400).json( err );
  });
});

// 바이크다 지점 조회
router.get('/branch', util.isLoggedin, function( req, res, next ) {
  var query = req.query || '';
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  if( Object.keys( query ).length > 0 ) {
    models.tb_branch_office.findAll( { where: query } ).then( result => {
      return res.status(200).json( result );
    }).catch( err => {
      return res.status(400).json( err );
    });
  } else {
    validationError.errors.search = {message:'조회 조건 미입력!'};
    return res.status(400).json(util.successFalse(validationError));
  }
});

// 바이크다 지점 등록
router.post('/branch', util.isLoggedin, function( req, res, next ) {
  var brcofcBsnsRgnmb = req.body.brcofcBsnsRgnmb || '';
  if( brcofcBsnsRgnmb.length > 0 ){
    if( branches.filter( branch => branch.brcofcBsnsRgnmb == brcofcBsnsRgnmb ).length < 1 ) {
      var branch = {
        brcofcBsnsRgnmb:brcofcBsnsRgnmb
      };
      return res.status(201).json(branch);
    } else {
      return res.status(400).json({err: '이미 등록된 지점 사업자 등록 번호. brcofcBsnsRgnmb : ' + brcofcBsnsRgnmb } );
    }
  } else {
    return res.status(400).json({err: '사업자 등록 번호 미입력. brcofcBsnsRgnmb'});
  }
});


module.exports = router;
