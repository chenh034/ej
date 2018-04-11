'use strict';

require('./global-regist');
const web = require('./servers/web');

Promise.resolve([web]).each(function (app) {
  app.start();
});
