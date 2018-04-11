'use strict';

const oneMinute = config.timeOuts.oneMinute / 1000;
const fiveMinute = config.timeOuts.fiveMinute / 1000;
const thirtyMinute = config.timeOuts.thirtyMinute / 1000;
const eightHour = config.timeOuts.eightHour / 1000;
const oneDay = config.timeOuts.oneDay / 1000;
const twoDay = config.timeOuts.twoDay / 1000;
const oneWeek = config.timeOuts.oneWeek / 1000;
const oneMonth = config.timeOuts.oneMonth / 1000;

module.exports = {
  collections: {keyName: 'collections', expire: oneDay}
  // 
}