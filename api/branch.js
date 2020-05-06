var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;


// 바이크다 지점 API Document
router.get('/', function( req, res, next ) {
  res.render('branch', { title: '바이크다 지점 API' });
});

// 바이크다 지점 전체 목록
router.get('/branches', util.isLoggedin, function( req, res, next ) {
  models.branch_office.findAll().then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 조회( 사업자 등록번호, 지점명, 상호, 대표자명)
router.get('/branch', util.isLoggedin, function( req, res, next ) {
  var reqParam = req.query || '';
  var brcofcBsnsRgnmb = reqParam.brcofcBsnsRgnmb || '';
  var brcofcNm        = reqParam.brcofcNm || '';
  var brcofcMtlty     = reqParam.brcofcMtlty || '';
  var brcofcRprsntvNm = reqParam.brcofcRprsntvNm || '';

  var query = 'select * from tb_branch_offices where 1=1 ';
  if( brcofcBsnsRgnmb ) query += 'and brcofcBsnsRgnmb like "%' + brcofcBsnsRgnmb + '%" ';
  if( brcofcNm )        query += 'and brcofcNm like "%' + brcofcNm + '%" ';
  if( brcofcMtlty )     query += 'and brcofcMtlty like "%' + brcofcMtlty + '%" ';
  if( brcofcRprsntvNm ) query += 'and brcofcRprsntvNm like "%' + brcofcRprsntvNm + '%" ';

  models.sequelize.query( query ).spread( function ( result, metadata ) {
    return res.status(200).json( util.successTrue( result ) );
  }, function ( err ) {
    return res.status(400).json( util.successFalse( err ) );
  })
});

// 바이크다 지점 등록
router.post('/branch', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };

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
