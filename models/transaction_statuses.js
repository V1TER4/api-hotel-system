'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class transaction_statuses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaction_statuses.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction_status',
  });
  return transaction_statuses;
};