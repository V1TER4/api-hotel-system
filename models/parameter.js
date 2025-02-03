'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Parameter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Parameter.init({
    code: DataTypes.STRING,
    description: DataTypes.STRING,
    value: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'parameter',
  });
  return Parameter;
};