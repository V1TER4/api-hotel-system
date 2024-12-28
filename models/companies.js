'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class companies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  companies.init({
    name: DataTypes.STRING,
    document: DataTypes.INTEGER,
    company_type_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'companies',
  });
  return companies;
};