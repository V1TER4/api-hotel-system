import { readdir } from 'fs/promises';
import path from 'path';

const __dirname = path.resolve();

const constants = {};

// Caminho da pasta
const directoryPath = path.resolve(__dirname, 'constants');

const files = await readdir(directoryPath);

for (const file of files) {
    if (file === 'index.js') continue; // Ignorar este arquivo

    const filePath = path.join(directoryPath, file);
    const moduleName = path.basename(file, path.extname(file)); // Nome sem extensão
    const module = await import(`file://${filePath}`); // Importar dinamicamente

    constants[moduleName] = module.default || module;
}

export default constants;