var express = require('express');
var router = express.Router();

// Bikeda branch index page Branch API Document
router.get('/', function( req, res, next ) {
  res.render('branch', { title: 'Bikeda Branch API' });
});

// Bikeda get Branch list
router.get('/branches', function( req, res, next ) {
  var branches = global.branches;
  return res.json( branches );
});

// Bikeda get Branch
router.get('/branch/:bsns_rgnmb', function( req, res, next ) {
  var branches = global.branches;
  var bsns_rgnmb = req.params.bsns_rgnmb;
  var branch = branches.filter( branch => branch.bsns_rgnmb == bsns_rgnmb );
  return res.json( branch );
});

// Bikeda post Branch
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
      return res.status(401).json({err: 'Already registered. bsns_rgnmb : ' + bsns_rgnmb } );
    }
  } else {
    return res.status(401).json({err: 'Incorrect bsns_rgnmb'});
  }
});
module.exports = router;
