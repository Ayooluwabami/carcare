import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import logger from '../utils/logger';

export const validateObjectId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    logger.error(`Invalid ObjectId: ${id}`);
    res.status(400).json({ message: 'Invalid ID' });
    return;
  }

  next();
};
