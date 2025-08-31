'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const { default: db } = await import('../models/index.js');
  const seedExecuted = await db.seedHistories.findOne({
    where: { name: 'CreatingTransactionStatusesSeeder' },
  });

  if (seedExecuted) {
    return;
  }

  await queryInterface.bulkInsert('transaction_statuses', [
    { description: 'Paid', createdAt: new Date(), updatedAt: new Date() },
    { description: 'Pendent', createdAt: new Date(), updatedAt: new Date() },
    { description: 'Denied', createdAt: new Date(), updatedAt: new Date() }
  ], {});
}
export async function down(queryInterface, Sequelize) {
  const { default: db } = await import('../models/index.js');
  const seedExecuted = await db.seedHistories.findOne({
    where: { name: 'CreatingTransactionStatusesSeeder' },
  });
  if (seedExecuted) {
    await seedExecuted.destroy();
  }

  await queryInterface.bulkDelete('transaction_statuses', null, {});
}
