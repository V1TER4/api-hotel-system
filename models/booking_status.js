'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
  class booking_status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  booking_status.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'booking_status',
  });
  return booking_status;
};