import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import mechanicRoutes from './routes/mechanicRoutes';
import serviceRoutes from './routes/serviceRoutes';
import errorHandler from './middleware/errorMiddleware';
import logger from './utils/logger';
import { sendErrorResponse } from './utils/responseUtil';

dotenv.config();

const app = express();

// Create a logger middleware
const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next();
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Database connection
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  logger.error('MONGODB_URI is not defined in environment variables.');
  process.exit(1); // Exit if the environment variable is not set
}

mongoose.connect(mongoUri)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch(err => {
    logger.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application on connection error
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/services', serviceRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 Not Found handler
app.use((req: Request, res: Response) => {
  sendErrorResponse(res, 404, 'Not Found');
});

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down gracefully...');
  try {
    await mongoose.connection.close(); // Wait for connection to close
    logger.info('MongoDB connection closed.');
    process.exit(0); // Exit the application
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
    process.exit(1); // Exit with failure
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
