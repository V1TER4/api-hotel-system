'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addColumn('hotels', 'address_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'addresses',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });

  await queryInterface.addColumn('hotels', 'company_id', {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'companies',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.removeColumn('hotels', 'address_id');
  await queryInterface.removeColumn('hotels', 'company_id');
}
