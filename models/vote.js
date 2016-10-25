"use strict";

var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  var Vote = sequelize.define('Vote', {
    ip: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Vote.belongsTo(models.Choice, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });

  return Vote;
};
