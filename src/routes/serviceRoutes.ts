import { Router, Request, Response, NextFunction } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController';
import authMiddleware from '../middleware/authMiddleware';
import { validateObjectId } from '../middleware/validateObjectId';
import { validateServiceInput } from '../middleware/validateServiceInput';
import { sendErrorResponse } from '../utils/responseUtil';

const router = Router();

// Centralized async handler
const asyncHandler = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    sendErrorResponse(res, 500, (error as Error).message);
    next(error);
  }
};

// Get all Services Route
router.get('/', asyncHandler(getAllServices));

// Get Service by ID Route
router.get('/:id', validateObjectId, asyncHandler(getServiceById));

// Create a New Service Route
router.post('/', authMiddleware, validateServiceInput, asyncHandler(createService));

// Update a Service Route
router.put('/:id', authMiddleware, validateObjectId, asyncHandler(updateService));

// Delete a Service Route
router.delete('/:id', authMiddleware, validateObjectId, asyncHandler(deleteService));

export default router;
