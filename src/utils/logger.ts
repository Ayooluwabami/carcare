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
      format: winston.format.simple(), // Include a timestamp with each log
    }),
    // Optional: Log messages to a file
    new winston.transports.File({
      filename: 'error.log', // Log errors to a file
      level: 'error', // Only log error level messages to this file
    }),
  ],
});

// Log message methods
['info', 'error', 'warn', 'debug'].forEach((level) => {
  (logger as any)[level] = (message: string) => {
    logger.log(level, message);
  };
});

export default logger;
