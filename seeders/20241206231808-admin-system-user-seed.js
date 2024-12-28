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
    where: { name: 'CreateAdminSystemSeed' },
  });
  
  if (seedExecuted) {
    return;
  }
  
  const { default: statuses } = await import('../constants/status.js');
  const { default: userType } = await import('../constants/userType.js');

  await queryInterface.bulkInsert('addresses', [{
    street: 'Rua João Batista Cardoso',
    number: 123,
    district: 'Vila Madalena',
    city_id: 3830,
    country_id: 1,
    postal_code: '05449040',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    street: 'Avenida Federico Felini',
    number: 456,
    district: 'Parque Anhangüera',
    city_id: 3830,
    country_id: 1,
    postal_code: '05120010',
    createdAt: new Date(),
    updatedAt: new Date()
  }], {});
  
  await queryInterface.bulkInsert('users', [{
    id: 1,
    name: "Admin",
    email: "admin@admin.com",
    password: await passwordEncript('admin'),
    telephone: '11999999999',
    address_id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    user_type_id: userType.USERTYPE.ADMIN,
    status_id: statuses.STATUS.ACTIVE,
  }, {
    id: 2,
    name: "System",
    email: 'system@system.com',
    password: await passwordEncript('system'),
    telephone: '11888888888',
    address_id: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    user_type_id: userType.USERTYPE.SYSTEM,
    status_id: statuses.STATUS.ACTIVE,
  }], {});
  
  await db.seedHistories.create({
    name: 'CreateAdminSystemSeed',
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
    where: { name: 'CreateAdminSystemSeed' },
  });
  if (seedExecuted) {
    await seedExecuted.destroy();
  }
  await queryInterface.bulkDelete('users', null, {});
  await queryInterface.bulkDelete('addresses', null, {});
}

async function passwordEncript(password) {
  const bcrypt = await import('bcrypt');
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
}