'use strict';

import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename as _basename } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import SeedHistory from './seedhistory.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basename = _basename(__filename);

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

async function loadModels() {
  const files = readdirSync(__dirname).filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  });

  for (const file of files) {
    const modelPath = join(__dirname, file);
    const { default: model } = await import(modelPath);
    const initializedModel = model(sequelize, DataTypes);
    db[initializedModel.name] = initializedModel;
  }

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

await loadModels();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;  // Exporta o objeto db como padrão (default export)
