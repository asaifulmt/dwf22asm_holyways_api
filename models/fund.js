'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fund extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user, userDonate }) {
      // define association here
      this.belongsToMany(user, { as: 'usersDonate', through: userDonate })
    }
    toJSON(){
      return {...this.get(), userId: undefined, createdAt: undefined, updatedAt: undefined}
    }
  };
  fund.init({
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    thumbnail: DataTypes.STRING,
    goal: DataTypes.INTEGER,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'fund'
  });
  return fund;
};
