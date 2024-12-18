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
    console.log('A seed de usuários já foi executada.');
    return;
  }

  await queryInterface.bulkInsert('statuses', [{
    id: 1, 
    description: 'Ativo',
    createdAt: new Date(),
    updatedAt: new Date(),
  }, {
    id: 2, 
    description: 'Inativo',
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {});

  await db.seedHistories.create({
    name: 'CreateStatusesSeeder',
    executedAt: new Date(),
  });

  console.log('Seed CreateStatusesSeeder executada com sucesso!');
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
    console.log('Achou a seed CreateStatusesSeeder')
    await seedExecuted.destroy(); 
  }
  await queryInterface.bulkDelete('statuses', null, {});
}