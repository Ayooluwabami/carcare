import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logger from '../utils/logger';

export const validateObjectId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.error(`Invalid ObjectId provided: ${id} in request to ${req.originalUrl}`);
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Invalid ID format',
    });
    return;
  }

  next(); // Pass control to the next middleware
};
