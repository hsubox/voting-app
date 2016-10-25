"use strict";

module.exports = function(sequelize, DataTypes) {

  var Choice = sequelize.define('Choice', {
    option: DataTypes.STRING
    }, {
    classMethods: {
      associate: function(models) {
        Choice.hasMany(models.Vote);
        Choice.belongsTo(models.Poll, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  });

  return Choice;
};
