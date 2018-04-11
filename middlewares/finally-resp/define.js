
'use strict';

const status = {
  200: {succeed: true, code: 200, status: 'success', desc: '成功'},
  500: {succeed: true, code: 500, status: 'interalError', desc: '服务器内部错误', view: '500'},
  404: {succeed: true, code: 404, status: 'notFound', desc: '接口不存在', view: '404'},
  403: {succeed: true, code: 403, status: 'noAuth', desc: '没有权限'}
};

module.exports = status;
