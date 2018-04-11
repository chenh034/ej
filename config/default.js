
'use strict';

const path = require('path');
const pkg  = require('../package.json');

module.exports = {
  web : {
    url : 'http://127.0.0.1:3002',
    host: '127.0.0.1',
    port: 3002,
    name: pkg.name
  },
  view : {
    cache : {},
    engine: 'ejs',
    dir   : 'views'
  },
  log : {
    dir : `／raid/${pkg.name}/log/`,
    nolog : /\.(js|css|png|jpg|jpeg|ico|svg|gif)/,
    format : ':remote-addr :method :url :status :response-time ms :user-agent :content-length',
    replaceConsole : true
  },
  static : {
    dir : path.join(__dirname, '../public'),
    maxAge: 1000 * 60 * 60,
    uploadDir : `/raid/${pkg.name}/upload/`
  },
  redis : {
    host : '127.0.0.1',
    port : 6379,
    db : 10,
    sessionDB : 2,
    password : ''
  },
  mysql : {
    host : '127.0.0.1',
    username : 'root',
    password : '159753',
    port : 3306,
    database : 'duoyi',
    connectTimeout : 5000,
    waitForConnections : true,
    maxConnections : 200,
    minConnections : 2,
    logging : true
  },
  timeOuts: {
    once:0,
    oneMinute    : 60000,
    fiveMinute   : 300000,
    tenMinute    : 600000,
    fifteenMinute: 900000,
    thirtyMinute : 1800000,
    onHour       : 3600000,
    twoHour      : 7200000,
    sixHour      : 21600000,
    eightHour    : 28800000,
    twelveHour   : 43200000,
    oneDay       : 86400000,
    twoDay       : 172800000,
    oneWeek      : 604800000,
    oneMonth     : 2592000000
  }
};
