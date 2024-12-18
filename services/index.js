import { readdir } from 'fs/promises';
import path from 'path';

const __dirname = path.resolve();

const services = {};

// Caminho da pasta
const directoryPath = path.resolve(__dirname, 'services');

const files = await readdir(directoryPath);

for (const file of files) {
    if (file === 'index.js') continue; // Ignorar este arquivo

    const filePath = path.join(directoryPath, file);
    const serviceName = path.basename(file, path.extname(file)); // Nome sem extensão
    const service = await import(`file://${filePath}`); // Importar dinamicamente

    services[serviceName] = service.default || service;
}

export default services;
