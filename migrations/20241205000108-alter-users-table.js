'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */

  await queryInterface.addColumn('users', 'user_type_id', {
    type: Sequelize.INTEGER,
    defaultValue: 3,
    allowNull: false,
    references: {
      model: 'user_types',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  });

  await queryInterface.addColumn('users', 'status_id', {
    type: Sequelize.INTEGER,
    defaultValue: 2,
    allowNull: false,
    references: {
      model: 'statuses',
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
  await queryInterface.removeConstraint('users', 'users_user_type_id_foreign_idx');
  await queryInterface.removeConstraint('users', 'users_status_id_foreign_idx');

  await queryInterface.removeColumn('users', 'user_type_id');
  await queryInterface.removeColumn('users', 'status_id');

}
