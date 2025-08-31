'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('bookings', 'transaction_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'transactions',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    after: 'status_id' // specify the column order
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('bookings', 'transaction_id');
}
