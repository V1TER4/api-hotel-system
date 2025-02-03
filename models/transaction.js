'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.transaction_status, { foreignKey: 'status_id', as: 'transaction_statuses' });
    }
  }
  Transaction.init({
    payment_id: DataTypes.STRING,
    nsu: DataTypes.STRING,
    amount: DataTypes.STRING,
    currency: DataTypes.DECIMAL,
    installments: DataTypes.STRING,
    creadit_card_token: DataTypes.INTEGER,
    status_id: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return Transaction;
};