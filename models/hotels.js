'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class Hotels extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hotels.belongsTo(models.address, { foreignKey: 'address_id' });
      Hotels.belongsTo(models.companies, { foreignKey: 'company_id' });
      Hotels.hasMany(models.hotel_rooms, { foreignKey: 'hotel_id' });
      Hotels.belongsTo(models.statuses, { foreignKey: 'status_id' });
    }
  }
  Hotels.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    telephone: DataTypes.STRING,
    rooms: DataTypes.INTEGER,
    address_id: DataTypes.INTEGER,
    company_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'hotels',
  });
  return Hotels;
};