import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Custom error class
class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor); // Capture stack trace
  }
}

// Middleware to handle errors
const errorMiddleware = (err: CustomError | Error, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = (err instanceof CustomError) ? err.statusCode : 500; // Default to 500 if no status code provided
  const message = err.message || 'Internal Server Error';
  const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined; // Show stack trace only in development

  // Log the error
  logger.error(`Error: ${message}, Status Code: ${statusCode}, Path: ${req.originalUrl}`, {
    stack, // Include stack trace in log for development only
  });

  // Send response to client
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(stack && { stack }), // Include stack trace only in development
  });
};

export default errorMiddleware;
