'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.address, { foreignKey: 'address_id' });
      User.belongsTo(models.user_types, { foreignKey: 'user_type_id' });
      User.belongsTo(models.statuses, { foreignKey: 'status_id' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    telephone: DataTypes.STRING,
    token: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    user_type_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER,
    address_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'users',
  });
  return User;
};