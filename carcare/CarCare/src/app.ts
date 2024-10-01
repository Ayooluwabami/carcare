import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import mechanicRoutes from './routes/mechanicRoutes';
import serviceRoutes from './routes/serviceRoutes';
import errorHandler from './middleware/errorMiddleware';
import logger from './utils/logger';

dotenv.config();

const app = express();

// Create a logger middleware
const loggerMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.info(`Request: ${req.method} ${req.url}`);
  next(); 
};

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware); 

// Database connection
mongoose.connect(process.env.MONGODB_URI!, {})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/services', serviceRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;
