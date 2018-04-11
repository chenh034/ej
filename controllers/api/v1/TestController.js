
'use strict';

// const userService = require('../../../services/user');
module.exports = handleError({
  index,
  get
});

async function index(req, res, next) {
  return next({code: 200});
}

async function get(req, res, next) {
  return next({code: 200});
}
