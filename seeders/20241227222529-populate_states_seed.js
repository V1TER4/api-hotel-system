'use strict';

import axios from 'axios';

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
    where: { name: 'PopulateStatesSeed' },
  });

  if (seedExecuted) {
    return;
  }

  const { data: states } = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
  for (let index = 0; index < states.length; index++) {
    const element = states[index];

    await queryInterface.bulkInsert('states', [{
      name: element.nome,
      uf: element.sigla,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  }

  await db.seedHistories.create({
    name: 'PopulateStatesSeed',
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
    where: { name: 'PopulateStatesSeed' },
  });
  if (seedExecuted) {
    await seedExecuted.destroy();
  }
  await queryInterface.bulkDelete('states', null, {});
}
