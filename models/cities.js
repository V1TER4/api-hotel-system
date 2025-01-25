'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class cities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  cities.init({
    name: DataTypes.STRING,
    uf: DataTypes.CHAR(2)
  }, {
    sequelize,
    modelName: 'cities',
  });
  return cities;
};