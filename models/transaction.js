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
    PaymentId: DataTypes.STRING,
    MerchantOrderId: DataTypes.STRING,
    Status: DataTypes.STRING,
    Amount: DataTypes.DECIMAL,
    Currency: DataTypes.STRING,
    Installments: DataTypes.INTEGER,
    CreditCardNumber: DataTypes.STRING,
    CreditCardHolder: DataTypes.STRING,
    CreditCardExpirationDate: DataTypes.STRING,
    CreditCardBrand: DataTypes.STRING,
    CreditCardToken: DataTypes.STRING,
    CreatedAt: DataTypes.DATE,
    UpdatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return Transaction;
};