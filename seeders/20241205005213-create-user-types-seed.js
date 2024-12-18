'use strict';

export async function up(queryInterface, Sequelize) {
  const { default: db } = await import('../models/index.js');
  
  const seedExecuted = await db.seedHistories.findOne({
    where: { name: 'CreateUserTypeSeeder' },
  });
  
  if (seedExecuted) {
    console.log('A seed de usuários já foi executada.');
    return;
  }
  
  try {
    await queryInterface.bulkInsert('user_types', [
      { id: 1, description: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, description: 'System', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, description: 'User', createdAt: new Date(), updatedAt: new Date() },
    ], {});
    
    await db.seedHistories.create({
      name: 'CreateUserTypeSeeder',
      executedAt: new Date(),
    });
    
    console.log('Seed CreateUserTypeSeeder executada com sucesso!');
  } catch (error) {
    console.error('Erro ao executar a seed:', error);
  }
}

export async function down(queryInterface, Sequelize) {
  const { default: db } = await import('../models/index.js');
  const seedExecuted = await db.seedHistories.findOne({
    where: { name: 'CreateUserTypeSeeder' },
  });
  if (seedExecuted) {
    console.log('Achou a seed CreateUserTypeSeeder')
    await seedExecuted.destroy();
  }
  await queryInterface.bulkDelete('user_types', null, {});
}
