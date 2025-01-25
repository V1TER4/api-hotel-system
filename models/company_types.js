'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class company_types extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  company_types.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'company_types',
  });
  return company_types;
};