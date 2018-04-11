'use strict';

const Redis = require('redis');
const redis = Redis.createClient({'host': config.redis.host, 'port': config.redis.port});
const redisAsync = Promise.promisifyAll(redis);

redis.select(config.redis.db, function () {
  logger.info('redis数据库:', config.redis.db);
});

redis.on('connect', function () {
  logger.info('redis已连接');
});

redis.on('error', function (err) {
  logger.error('redis连接出错:', err);
});

module.exports = {
  redis              : redis,
  redisAsync         : redisAsync,
  setToCache         : setToCache,
  getFromCache       : getFromCache,
  getKeysFromCache   : getKeysFromCache,
  delStrikeyFromCache: delStrikeyFromCache,
  saddToCache        : saddToCache,
  spopFromCache      : spopFromCache,
  scardFromCache     : scardFromCache,
  hsetToCache        : hsetToCache,
  hdelFromCache      : hdelFromCache,
  hdelAllFromCache   : hdelAllFromCache,
  hincrbyFromCache   : hincrbyFromCache,
  hgetFromCache      : hgetFromCache,
  hmsetToCache       : hmsetToCache,
  hgetallFromCache   : hgetallFromCache,
  zaddToCache        : zaddToCache,
  zremFromCache      : zremFromCache,
  zscoreFromCahe     : zscoreFromCahe,
  zunionstoreFromCache: zunionstoreFromCache,
  zcardAsync         : zcardFromCache,
  getListFromCache   : getListFromCache,
  setListToCache     : setListToCache
};

/**
 * 写入字符串至缓存
 * @param {string} keyName 
 * @param {object} content
 * @param {number} expire
 * @return {*}
 */
function setToCache(keyName, content, expire = 0) {
  if (!expire) {
    return null;
  }
  return redisAsync.setAsync(
    keyName,
    JSON.stringify(content)
  ).then(function () {
    return redisAsync.expireAsync(keyName, expire);
  });
}

/**
 * 获取缓存的字符串
 * @param {string} keyName  键名
 * @param {function} fun    如果缓存数据已过期或需要重载时执行的数据库查询函数
 * @param {number} expire   过期时间
 * @param {number} refresh  是否刷新缓存
 * @return {*} 
 */
async function getFromCache(keyName, fun, expire, refresh) {
  // 检查该字段是否有固定过期时间
  if (cacheKeys[keyName]) {
    expire = cacheKeys[keyName].expire || 0;
  }

  const detail = await redisAsync.getAsync(keyName);
  if (!refresh && detail !== null) {
    return JSON.parse(detail);
  }
  if (typeof fun === 'function') {
    const newData = await fun();
    await setToCache(keyName, newData, expire);
    return newData;
  }
  return null;
}

/**
 * 删除缓存中的字符串
 * @param {string} keyName
 */
async function delStrikeyFromCache(keyName) {
  const result = redisAsync.delAsync(keyName);
  return result;
}

/**
 * 获取缓存的数据键
 * @param {String} keyName
 * @return {*}
 */
async function getKeysFromCache(keyName) {
  const result = await redisAsync.keysAsync(keyName);
  return result;
}

/**
 * 获取缓存中某集合的元素个数
 * @param {string} keyName
 * @return {*}
 */
async function scardFromCache(keyName) {
  const result = await redisAsync.scardAsync(keyName);
  return result;
}

/**
 * 向缓存中某集合添加元素
 * @param {string} keyName
 * @param {object} content
 * @return {*}
 */
async function saddToCache(keyName, content) {
  return await redisAsync.saddAsync(keyName, content);
}

/**
 * pop set
 * @param {string} keyName
 * @return {*}
 */
async function spopFromCache(keyName) {
  return await redisAsync.spopAsync(keyName);
}

/**
 * 向缓存中某hash的指定字段加上一个增量
 * @param {string} keyName
 * @param {string} fieldName
 * @param {number} value
 * @return {*}
 */
async function hincrbyFromCache(keyName, fieldName, value) {
  return await redisAsync.hincrbyAsync(keyName, fieldName, value);
}

/**
 * 将缓存中某hash的指定字段设置为value
 * @param {string} keyName
 * @param {string} fieldName
 * @param {object} content
 * @param {number} expire
 * @return {*}
 */
async function hsetToCache(keyName, fieldName, content, expire = 0) {
  if (!expire) {
    return null;
  }
  await redisAsync.hsetAsync(
    keyName,
    fieldName,
    JSON.stringify(content || '')
  );
  return await redisAsync.expireAsync(keyName, expire);
}

/**
 * 从缓存中获取某hash的指定字段值
 * @param {string} keyName
 * @param {string} fieldName
 * @param {function} func     缓存过期或需要刷新时的数据库查询函数
 * @param {number} expire
 * @param {number} refresh
 */
async function hgetFromCache(keyName, fieldName, func, expire, refresh) {
  if (cacheKeys[keyName]) {
    expire = cacheKeys[keyName].expire || 0;
  }
  const detail = await redisAsync.hgetAsync(keyName, fieldName);
  if (!refresh && detail !==null) {
    return JSON.parse(detail);
  }
  if (typeof func === 'function') {
    const newData = func();
    hsetToCache(keyName, fieldName, newData, expire);
    return newData;
  }
  return null;
}

/**
 * 将缓存中某hash的指定字段删除
 * @param {string} keyName
 * @param {string} fieldName
 * @return {*}
 */
async function hdelFromCache(keyName, fieldName){
  return await redisAsync.hdelAsync(keyName, fieldName);
}

/**
 * 将缓存中某hash的所有字段删除
 * @param {string} keyName
 * @return {*}
 */
async function hdelAllFromCache(keyName) {
  const hkeys = await redisAsync.hkeysAsync(keyName);
  hkeys.forEach(function (field) {
    hdelFromCache(keyName, field);
  });
}

/**
 * 批量插入hash
 * @param {string} keyName
 * @param {object} options
 * @param {number} expire
 * @return {*}
 */
async function hmsetToCache(keyName, options, expire = 0) {
  if (!expire) {
    return null;
  }
  await redisAsync.hmsetAsync(keyName, options);
  return await redisAsync.expireAsync(keyName, expire);
}

/**
 * 批量获取hash
 * @param {string} keyName
 * @param {function} func
 * @param {number} expire
 * @param {number} refresh
 * @return {*}
 */
async function hgetallFromCache(keyName, func, expire, refresh = 0) {
  if (cacheKeys[keyName]) {
    expire = cacheKeys[keyName].expire || 0;
  }
  const data = await redisAsync.hgetall(keyName);
  if (JSON.stringify(data) !== '{}' && !refresh) {
    return data;
  }
  if (typeof func === 'function') {
    const content = await func();
    hmsetToCache(keyName, content, expire);
    return content;
  }
  return null;
}

/**
 * 向有序集合中添加元素
 * @param {string} keyName
 * @param {array} arr
 * @return {*}
 */
async function zaddToCache(keyName, arr, expire = 0) {
  if (!expire) {
    return null;
  }
  await redisAsync.zaddAsync(keyName, arr);
  return redisAsync.expireAsync(keyName, expire);
}

/**
 * 有序集合中移除元素
 * @param {string} keyName
 * @param {array} arr
 * @return {*}
 */
async function zremFromCache(keyName, arr) {
  return redisAsync.zremAsync(keyName, arr);
}

/**
 * 有序集合中返回成员的分数值
 * @param {string} keyName
 * @param {string} member
 * @return {*}
 */
async function zscoreFromCahe(keyName, member) {
  const rs = await redisAsync.zscoreAsync(keyName, member);
  return rs;
}

/**
 * 计算给定一个或多个有序集合的并集
 * @param {string} keyName
 * @param {string} key1
 * @param {string} key2
 * @return {*}
 */
async function zunionstoreFromCache(keyName, key1, key2) {
  return redisAsync.zunionstoreAsync(keyName, 2, key1, key2);
}

/**
 * 获取有序集合的成员数
 * @param {string} keyName
 * @return {*}
 */
async function zcardFromCache(keyName) {
  return redisAsync.zcardAsync(keyName);
}

/**
 * 向缓存中添加添加一个list
 * @param {string} keyName
 * @param {array} list
 * @return {*}
 */
async function setListToCache(keyName, list) {
  if (typeof list !== 'object') {
    return null;
  }
  redisAsync.delAsync(keyName);
  list.forEach(async function (item) {
    await redisAsync.rpushAsync(keyName, item);
  });
  const expire = config.timeOuts.oneMinute / 1000;
  return await redisAsync.expireAsync(keyName, expire);
}

/**
 * 从缓存中获取某个list
 * @param {object} options
 * @return {*}
 */
async function getListFromCache(options) {
  const start   = options.start;
  const count   = options.count;
  const keyName = options.keyName;
  const stop    = start + count - 1;
  const list = await redisAsync.lrangeAsync(keyName, start, stop);
  return list;
}