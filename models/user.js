"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    twitterId: DataTypes.STRING,
    twitterDisplayName: DataTypes.STRING
  }, {
    classMethods: {

    }
  });

  return User;
};
