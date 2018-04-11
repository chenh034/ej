'use strict';

module.exports = {
  getList: getList
}

/**
 * 分页获取数据
 * @param {object} options
 */
async function getList(options) {
  let page   = options.page || 1;
  let size   = options.size || 10;
  let offset = size * (page - 1);
  let result = db.User.findAndCountAll({
    offset: Number(offset),
    limit : Number(size),
    order : [['id', 'desc']]
  });
  return result;
}