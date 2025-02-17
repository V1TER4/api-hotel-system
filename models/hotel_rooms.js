'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class HotelRooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HotelRooms.belongsTo(models.hotels, { foreignKey: 'hotel_id' });
    }
  }
  HotelRooms.init({
    hotel_id: DataTypes.INTEGER,
    room_number: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'hotel_rooms',
  });
  return HotelRooms;
};