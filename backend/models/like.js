'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Like.belongsTo (models.User, {
        foreignKey: {
          allowNull: false
        }
      })
      models.Like.belongsTo (models.Post, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  Like.init({
    PostId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};