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
    console.log('A seed de usuários já foi executada.');
    return;
  }
  
  const { default: statuses } = await import('../constants/status.js');
  const { default: userType } = await import('../constants/userType.js');
  
  await queryInterface.bulkInsert('users', [{
    id: 1,
    name: "Admin",
    email: "admin@admin.com",
    password: await passwordEncript('admin'),
    createdAt: new Date(),
    updatedAt: new Date(),
    user_type_id: userType.USERTYPE.ADMIN,
    status_id: statuses.STATUS.ACTIVE,
  }, {
    id: 2,
    name: "System",
    email: 'system@system.com',
    password: await passwordEncript('system'),
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
}

async function passwordEncript(password) {
  const bcrypt = await import('bcrypt');
  const salt = await bcrypt.genSalt(10);

  return await bcrypt.hash(password, salt);
}