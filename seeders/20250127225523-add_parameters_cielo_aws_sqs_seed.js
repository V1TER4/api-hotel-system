'use strict';

export async function up(queryInterface, Sequelize) {
    const { default: db } = await import('../models/index.js');
    const seedExecuted = await db.seedHistories.findOne({
        where: { name: 'CreatingParameterDefaultSeeder' },
    });

    if (seedExecuted) {
        return;
    }

    try {
        
        await queryInterface.bulkInsert('parameters', [
        {
            code: 'AWS_ACCESS_KEY_ID',
            description: 'Aws Access Key',
            value: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            code: 'AWS_SECRET_ACCESS_KEY',
            description: 'Aws Secret Access Key',
            value: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            code: 'AWS_REGION',
            description: 'Região Aws',
            value: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            code: 'SQS_QUEUE_URL',
            description: 'Url SQS',
            value: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            code: 'CIELO_URL_API',
            description: 'Url Pagamento Cielo',
            value: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            code: 'CIELO_CONSULT_URL_API',
            description: 'Url de Consulta Cielo',
            value: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            code: 'CIELO_CLIENT_ID',
            description: 'Client ID Cielo',
            value: null,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            code: 'CIELO_CLIENT_SECRET',
            description: 'Client Secret Cielo',
            value: null,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        ], {});
    } catch (error) {
        console.error('Erro ao executar a seed:', error);
    }
}
export async function down(queryInterface, Sequelize) {
    const { default: db } = await import('../models/index.js');
    const seedExecuted = await db.seedHistories.findOne({
        where: { name: 'CreatingParameterDefaultSeeder' },
    });
    if (seedExecuted) {
        await seedExecuted.destroy();
    }
    await queryInterface.bulkDelete('parameters', null, {});
}