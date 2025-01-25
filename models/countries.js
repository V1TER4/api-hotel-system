'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class countries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  countries.init({
    name: DataTypes.STRING,
    abbreviation: DataTypes.CHAR
  }, {
    sequelize,
    modelName: 'countries',
  });
  return countries;
};