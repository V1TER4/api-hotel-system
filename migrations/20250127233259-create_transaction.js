'use strict';

/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        payment_id: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.DECIMAL
        },
        currency: {
            type: Sequelize.STRING
        },
        installments: {
            type: Sequelize.INTEGER
        },
        creadit_card_token: {
            type: Sequelize.STRING
        },
        status_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'transaction_statuses',
                key: 'id'
            },
        },
        created_at: {
            type: Sequelize.DATE
        },
        updated_at: {
            type: Sequelize.DATE
        }
    });
}
export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transactions');
}