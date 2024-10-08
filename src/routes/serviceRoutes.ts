import { Router } from 'express';
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

const router = Router();

// Get all Services Route
router.get('/', getAllServices);

// Get Service by ID Route
router.get('/:id', validateObjectId, getServiceById);

// Create a New Service Route
router.post('/', authMiddleware, validateServiceInput, createService);

// Update a Service Route
router.put('/:id', authMiddleware, validateObjectId, updateService);

// Delete a Service Route
router.delete('/:id', authMiddleware, validateObjectId, deleteService);

export default router;
