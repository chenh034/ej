'use strict';

global.ROOT_PATH   = __dirname;
global.config      = require('config');
global._           = require('lodash');
global.Promise     = require('bluebird');
global.fse         = require('fs-extra');
global.logger      = require('./tools/logger');
global.db          = require('./models');
global.handleError = require('./middlewares/error-handle');
// global.paramValidator = require('./middlewares/param-validator');
global.cache       = require('./cache/cache');
global.cacheKeys   = require('./cache/keys');
