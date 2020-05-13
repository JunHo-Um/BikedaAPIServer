var express = require('express');
var router = express.Router();
var util = require('../util');
var models = require('../models');
var sequelize = require("sequelize");
var Op = sequelize.Op;
var office_valid = require('../validate/branch_office');
var point_valid = require('../validate/branch_point');


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
  var validErrors = office_valid.create.validate( req.body );
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }

  var data = req.body;
  // 지점 등록 여부 검증
  models.branch_office.findOne( { where : { brcofcBsnsRgnmb: data.brcofcBsnsRgnmb } } ).then( result => {
    if( result ) {
      validationError.errors.already = {message:'이미 등록된 지점 사업자 등록 번호. brcofcBsnsRgnmb : ' + brcofcBsnsRgnmb };
      return res.status(400).json( util.successFalse( validationError) );
    }
    // 지점 ID 생성
    var query = "select cast( concat('B', lpad(concat(max(cast(substr(brcofcId, 2) AS unsigned))+ 1),4,'0') ) as char) as brcofcId from tb_branch_offices";
    var brcofcId = '';
    models.sequelize.query( query ).spread( function ( result, metadata ) {
      data.brcofcId = result[0].brcofcId;
      models.branch_office.create( data ).then( result => {
        return res.status(201).json( util.successTrue( result ) );
      }).catch( err => {
        return res.status(400).json( util.successFalse( err ) );
      });
    }, function ( err ) {
      return res.status(400).json( util.successFalse( err ) );
    });
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 수정
router.put('/branch', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  //입력 값 검증
  var validErrors = office_valid.update.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }

  var data = req.body;
  delete data.brcofcId;
  // 지점 등록 여부 검증
  models.branch_office.findOne( { where : { brcofcId: req.body.brcofcId } } ).then( result => {
    if( !result ) {
      validationError.errors.notfound = { message:'존재하지 않는 지점 ID. brcofcId : ' + brcofcId };
      return res.status(400).json( util.successFalse( validationError) );
    }
    models.branch_office.update( data, { where : { brcofcId: req.body.brcofcId } } ).then( result => {
      return res.status(201).json( util.successTrue( result ) );
    }).catch( err => {
      return res.status(400).json( util.successFalse( err ) );
    });

  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});

// 바이크다 지점 포인트 조회( 지점 ID, 포인트 구분 코드 )
router.get('/branch-point', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };
  var reqParam = req.query || '';
  var brcofcId      = reqParam.brcofcId || '';
  var pointSeCd     = reqParam.pointSeCd || '';

  if( !brcofcId ) {
    validationError.errors.notfound = { message:'지점 ID는 필수 입니다.' };
    return res.status(400).json( util.successFalse( validationError) );
  }
  var where = {}
  where.brcofcId = brcofcId;
  if( pointSeCd ) where.pointSeCd = pointSeCd;
  models.branch_point.findAll( { where : where } ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
// 바이크다 지점 포인트 등록
router.post('/branch-point', util.isLoggedin, function( req, res, next ) {
  var validationError = {
    name:'ValidationError',
    errors:{}
  };

  //입력 값 검증
  var validErrors = point_valid.create.validate(req.body);
  if( validErrors.length > 0 ){
    for( var error in validErrors ){
      var validError = validErrors[error];
      validationError.errors[validError.path] = {message: validError.message };
    }
    return res.status(400).json( util.successFalse( validationError) );
  }

  models.branch_point.create( req.body ).then( result => {
    return res.status(200).json( util.successTrue( result ) );
  }).catch( err => {
    return res.status(400).json( util.successFalse( err ) );
  });
});
module.exports = router;
