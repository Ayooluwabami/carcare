import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default logging level
  format: winston.format.combine(
    winston.format.timestamp(), // Include a timestamp with each log
    winston.format.json() // Log messages in JSON format
  ),
  transports: [
    // Log messages to the console
    new winston.transports.Console({
      format: winston.format.simple(), // Simple format for console logs
    }),
    // Optional: Log messages to a file
    new winston.transports.File({
      filename: 'error.log', // Log errors to a file
      level: 'error', // Only log error level messages to this file
    }),
  ],
});

// Log a message at info level
logger.info = (message: string) => {
  logger.log('info', message);
};

// Log a message at error level
logger.error = (message: string) => {
  logger.log('error', message);
};

// Optional: Add more log levels if needed
logger.warn = (message: string) => {
  logger.log('warn', message);
};

logger.debug = (message: string) => {
  logger.log('debug', message);
};

export default logger;
