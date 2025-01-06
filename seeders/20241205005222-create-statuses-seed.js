'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
  */
  const { default: db } = await import('../models/index.js');
  const seedExecuted = await db.seedHistories.findOne({
    where: { name: 'CreateStatusesSeeder' },
  });

  if (seedExecuted) {
    return;
  }

  await queryInterface.bulkInsert('statuses', [{
    id: 1, 
    description: 'Active',
    createdAt: new Date(),
    updatedAt: new Date(),
  }, {
    id: 2, 
    description: 'Inactive',
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {});

  await db.seedHistories.create({
    name: 'CreateStatusesSeeder',
    executedAt: new Date(),
  });

}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
  const { default: db } = await import('../models/index.js');
  const seedExecuted = await db.seedHistories.findOne({
    where: { name: 'CreateStatusesSeeder' },
  });
  if (seedExecuted) {
    await seedExecuted.destroy(); 
  }
  await queryInterface.bulkDelete('statuses', null, {});
}