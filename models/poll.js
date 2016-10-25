"use strict";

module.exports = function(sequelize, DataTypes) {

  var Poll = sequelize.define('Poll', {
    question: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
          Poll.hasMany(models.Choice);
        }
      }
    }
  );

  return Poll;
};
