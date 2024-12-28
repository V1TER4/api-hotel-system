'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class hotel_rooms extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  hotel_rooms.init({
    hotel_id: DataTypes.INTEGER,
    room_number: DataTypes.STRING,
    capacity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'hotel_rooms',
  });
  return hotel_rooms;
};