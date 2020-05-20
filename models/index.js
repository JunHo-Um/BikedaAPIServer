'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.branch_office = require('./branch_office')(sequelize, Sequelize);
db.branch_point = require('./branch_point')(sequelize, Sequelize);
db.branch_share = require('./branch_share')(sequelize, Sequelize);
db.store = require('./store')(sequelize, Sequelize);
db.store_point = require('./store_point')(sequelize, Sequelize);
db.store_surcharge = require('./store_surcharge')(sequelize, Sequelize);

module.exports = db;
