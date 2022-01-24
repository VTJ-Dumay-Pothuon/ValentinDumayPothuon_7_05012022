'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.hasMany(models.Comment, { onDelete: 'cascade' });
      models.Post.hasMany(models.Like,    { onDelete: 'cascade' });
      models.Post.belongsTo (models.User, {
        foreignKey: {
          allowNull: false
        }
      })
    }
  };
  Post.init({
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    body: DataTypes.TEXT,
    likes: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};