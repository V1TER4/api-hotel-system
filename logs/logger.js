import { createLogger, format, transports } from 'winston';

// Configuração do logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'combined.log' }),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

// Exporta o logger
export default logger;
