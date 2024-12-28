'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Status.init({
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'statuses',
  });
  return Status;
};