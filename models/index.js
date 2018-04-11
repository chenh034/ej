
'use strict';

const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const db = {};

const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password, {
  host : config.mysql.host,
  port : config.mysql.port,
  dialect : 'mysql',
  pool : {
    maxConnections : config.mysql.maxConnections,
    minConnections : config.mysql.minConnections
  },
  logging: false
});

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== -1) && (file !== 'index.js');
}).forEach(function (file) {
  let model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

module.exports = _.extend({
  sequelize : sequelize,
  Sequelize : Sequelize
}, db);
