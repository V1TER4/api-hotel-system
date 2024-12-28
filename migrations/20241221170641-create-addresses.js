'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('addresses', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    street: {
      type: Sequelize.STRING
    },
    number: {
      type: Sequelize.INTEGER
    },
    complement: {
      type: Sequelize.STRING
    },
    district: {
      type: Sequelize.STRING
    },
    city_id: {
      type: Sequelize.INTEGER
    },
    country_id: {
      type: Sequelize.INTEGER
    },
    postal_code: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('addresses');
}