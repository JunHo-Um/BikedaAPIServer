var express = require('express');
var router = express.Router();
var util = require('../util');

// 바이크다 지점 API Document
router.get('/', function( req, res, next ) {
  res.render('branch', { title: '바이크다 지점 API' });
});


// 바이크다 지점 목록
router.get('/branches', util.isLoggedin, function( req, res, next ) {
  var branches = global.branches;
  return res.json( branches );
});

// 바이크다 지점 조회
router.get('/branch/:brcofcBsnsRgnmb', util.isLoggedin, function( req, res, next ) {
  var branches = global.branches;
  var brcofcBsnsRgnmb = req.params.brcofcBsnsRgnmb;
  var branch = branches.filter( branch => branch.brcofcBsnsRgnmb == brcofcBsnsRgnmb );
  return res.json( branch );
});

// 바이크다 지점 등록
router.post('/branch', util.isLoggedin, function( req, res, next ) {
  var branches = global.branches;
  var brcofcBsnsRgnmb = req.body.brcofcBsnsRgnmb || '';
  if( brcofcBsnsRgnmb.length ){
    if( branches.filter( branch => branch.brcofcBsnsRgnmb == brcofcBsnsRgnmb ).length < 1 ) {
      var branch = {
        brcofcBsnsRgnmb:brcofcBsnsRgnmb
      };
      global.branches.push(branch);
      return res.status(201).json(branch);
    } else {
      return res.status(400).json({err: '이미 등록된 지점 사업자 등록 번호. brcofcBsnsRgnmb : ' + brcofcBsnsRgnmb } );
    }
  } else {
    return res.status(400).json({err: '사업자 등록 번호 미입력. brcofcBsnsRgnmb'});
  }
});


module.exports = router;
