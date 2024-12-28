'use strict';

import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename as _basename } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);

// Configuração do Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: process.env.DB_LOGGING === 'true',
  }
);

const db = {};

// Função para carregar os modelos
async function loadModels() {
  const files = readdirSync(__dirname).filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

  // Carregando os modelos
  for (const file of files) {
    const modelPath = join(__dirname, file);
    const { default: model } = await import(modelPath);
    const initializedModel = model(sequelize, DataTypes);
    db[initializedModel.name] = initializedModel;
  }

  // Chama as associações após carregar todos os modelos
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
