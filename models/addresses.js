'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Addresses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Addresses.hasOne(models.users, { foreignKey: 'address_id' });
      Addresses.belongsTo(models.cities, { foreignKey: 'city_id' });
      Addresses.belongsTo(models.countries, { foreignKey: 'country_id' });
    }
  }
  Addresses.init({
    street: DataTypes.STRING,
    number: DataTypes.INTEGER,
    complement: DataTypes.STRING,
    district: DataTypes.STRING,
    city_id: DataTypes.INTEGER,
    country_id: DataTypes.INTEGER,
    postal_code: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'address',
  });
  return Addresses;
};