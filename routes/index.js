
'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

function createRouter(dir) {
  const router = express.Router();
  fs.readdirSync(dir).forEach(function (file) {
    require(path.join(dir, file))(router);
  });
  return router;
}

const router = module.exports = express.Router();
const v1 = createRouter(path.join(__dirname, 'api/v1'));

router.use('/api/v1', v1);
