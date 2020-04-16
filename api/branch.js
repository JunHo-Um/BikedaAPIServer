var express = require('express');
var router = express.Router();

// Bikeda branch index page Branch API Document
router.get('/', function( req, res, next ) {
  res.render('branch', { title: '바이크다 지점 API' });
});

// Bikeda branch login
router.get('/branch-login/:bsns_rgnmb/:password', function( req, res, next ) {
  var branches = global.branches;
  var bsns_rgnmb = req.params.bsns_rgnmb;
  var password = req.params.password;
  if( branches.filter( branch => branch.bsns_rgnmb == bsns_rgnmb ).length < 1 ) {
    return res.status(400).json({err: '등록되지 않은 지점 사업자 등록 번호. bsns_rgnmb : ' + bsns_rgnmb } );
  }
  res.render('branch', { title: '바이크다 지점 API' });
});

// Bikeda select Branch list
router.get('/branches', function( req, res, next ) {
  var branches = global.branches;
  return res.json( branches );
});

// Bikeda select Branch
router.get('/branch/:bsns_rgnmb', function( req, res, next ) {
  var branches = global.branches;
  var bsns_rgnmb = req.params.bsns_rgnmb;
  var branch = branches.filter( branch => branch.bsns_rgnmb == bsns_rgnmb );
  return res.json( branch );
});

// Bikeda insert branch
router.post('/branch', function( req, res, next ) {
  var branches = global.branches;
  var bsns_rgnmb = req.body.bsns_rgnmb || '';
  if( bsns_rgnmb.length ){
    if( branches.filter( branch => branch.bsns_rgnmb == bsns_rgnmb ).length < 1 ) {
      var branch = {
        bsns_rgnmb:bsns_rgnmb
      };
      global.branches.push(branch);
      return res.status(201).json(branch);
    } else {
      return res.status(400).json({err: '이미 등록된 지점 사업자 등록 번호. bsns_rgnmb : ' + bsns_rgnmb } );
    }
  } else {
    return res.status(400).json({err: '사업자 등록 번호 미입력. bsns_rgnmb'});
  }
});


module.exports = router;
