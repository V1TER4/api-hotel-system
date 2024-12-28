'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class states extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  states.init({
    name: DataTypes.STRING,
    uf: DataTypes.CHAR,
    region: DataTypes.CHAR
  }, {
    sequelize,
    modelName: 'states',
  });
  return states;
};