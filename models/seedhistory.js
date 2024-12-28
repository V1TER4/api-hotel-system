'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class SeedHistory extends Model {
    static associate(models) {
      // define associations here if needed
    }
  }

  SeedHistory.init({
    name: DataTypes.STRING,
    executedAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'seedHistories',
  });

  return SeedHistory;
};
