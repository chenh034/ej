'use strict';

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    id : {
      field : 'id',
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      allowNull : false
    },
    username : {
      field : 'username',
      type : DataTypes.STRING(32),
      allowNull : false,
      defaultValue : 'user',
      comment : '用户名'
    },
    password : {
      field : 'password',
      type : DataTypes.STRING(32)
    }
  }, {
    tableName : 'tbl_user',
    freezeTableName : true,
    timestamps : false
  });
};
