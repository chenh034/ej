
'use strict';

const TestController = require('../../../controllers/api/v1/TestController');

module.exports = (router) => {
  router.get('/test/index', TestController.index);
  router.get('/test/get', TestController.get);
};
