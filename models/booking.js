'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      bookings.belongsTo(models.users, { foreignKey: 'user_id', as: 'user' });
      bookings.belongsTo(models.hotel_rooms, { foreignKey: 'room_id', as: 'hotel_room' });
      bookings.belongsTo(models.hotels, { foreignKey: 'hotel_id', as: 'hotel' });
      bookings.belongsTo(models.booking_status, { foreignKey: 'status_id', as: 'status' });
    }
  }
  bookings.init({
    user_id: DataTypes.INTEGER,
    room_id: DataTypes.INTEGER,
    hotel_id: DataTypes.INTEGER,
    reservation_date: DataTypes.DATE,
    checkin_date: DataTypes.DATE,
    checkout_date: DataTypes.DATE,
    total_guests: DataTypes.INTEGER,
    total_value: DataTypes.DECIMAL,
    status_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'bookings',
  });
  return bookings;
};