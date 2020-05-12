var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var schema = require('../validate/branch');

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

// 바이크다 지점 조회( 사업자 등록번호, 지점명, 상호, 대표자명 )
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
  });
});

// 바이크다 지점 등록
router.post('/branch', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };

  //입력 값 검증
  var validErrors = schema.create.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }
  // 지점 등록 여부 검증
  models.branch_office.findOne( { where : { brcofcBsnsRgnmb: req.body.brcofcBsnsRgnmb } } ).then( result => {
    if( result ) {
      validationError.errors.already = {message:'이미 등록된 지점 사업자 등록 번호. brcofcBsnsRgnmb : ' + brcofcBsnsRgnmb };
      return res.status(400).json( util.successFalse( validationError) );
    }
    // 지점 ID 생성
    var query = "select concat('B', lpad(concat(max(cast(substr(brcofcId, 2) AS unsigned))+ 1),4,'0') ) as brcofcId from tb_branch_offices";
    var brcofcId = '';
    models.sequelize.query( query ).spread( function ( result, metadata ) {
      brcofcId = result.brcofcId;
    }, function ( err ) {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });


  return res.status(201).json( util.successTrue( ) );
  // models.branch_office.create({
  //   brcofcId : brcofcId,
  //   brcofcBsnsRgnmb : brcofcBsnsRgnmb,
  //   brcofcPassword : brcofcPassword,
  //   brcofcNm : brcofcNm,
  //   brcofcMtlty : brcofcMtlty,
  //   brcofcBizSeCd : brcofcBizSeCd,
  //   brcofcRprsntvNm : brcofcRprsntvNm,
  //   brcofcBrdYmd : brcofcBrdYmd,
  //   brcofcCrprtRgnmb : brcofcCrprtRgnmb,
  //   brcofcOpnngYmd : brcofcOpnngYmd,
  //   brcofcBsnsPlaceAdres : brcofcBsnsPlaceAdres,
  //   brcofcHdofcAdres : brcofcHdofcAdres,
  //   brcofcBizcnd : brcofcBizcnd,
  //   brcofcInduty : brcofcInduty,
  //   brcofcTelno : brcofcTelno,
  //   brcofcCelno : brcofcCelno,
  //   brcofcVrtlAcnt : brcofcVrtlAcnt,
  //   brcofcFeeSeCd : brcofcFeeSeCd,
  //   brcofcFeeAmnt : brcofcFeeAmnt,
  //   brcofcFeeRate : brcofcFeeRate,
  //
  // });
});


module.exports = router;
