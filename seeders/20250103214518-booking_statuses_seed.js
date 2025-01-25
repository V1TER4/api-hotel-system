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
    where: { name: 'CreateBookingStatusSeeder' },
  });

  if (seedExecuted) {
    return;
  }

  try {
    await queryInterface.bulkInsert('booking_statuses', [
      { id: 1, description: 'Pending', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, description: 'Confirmed', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, description: 'Canceled', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    await db.seedHistories.create({
      name: 'CreateBookingStatusSeeder',
      executedAt: new Date(),
    });

    console.log('Seed CreateBookingStatusSeeder executada com sucesso!');
  } catch (error) {
    console.error('Erro ao executar a seed:', error);
  }
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
    where: { name: 'CreateBookingStatusSeeder' },
  });
  if (seedExecuted) {
    await seedExecuted.destroy();
  }
  await queryInterface.bulkDelete('booking_statuses', null, {});

}
