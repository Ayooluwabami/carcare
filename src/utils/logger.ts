import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
    level: 'info', 
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Log messages to the console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple() 
            ),
        }),
        // Optional: Log messages to a file
        new winston.transports.File({
            filename: 'error.log',
            level: 'error', 
            handleExceptions: true, 
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json() 
            ),
        }),
    ],
    exitOnError: false, // Prevent Winston from exiting on handled exceptions
});

// Log message methods
['info', 'error', 'warn', 'debug'].forEach((level) => {
    (logger as any)[level] = (message: string, meta?: any) => {
        logger.log(level, message, { meta }); // Optional meta for additional data
    };
});

export default logger;
