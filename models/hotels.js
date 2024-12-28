'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class hotels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  hotels.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'hotels',
  });
  return hotels;
};