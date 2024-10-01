import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController'; 
import authMiddleware from '../middleware/authMiddleware'; 
import { validateObjectId } from '../middleware/validateObjectId'; // Optional: validate ID format

const router = Router();

// Get all Services Route
router.get('/', getAllServices);

// Get Service by ID Route
router.get('/:id', validateObjectId, getServiceById); // Validate ID before fetching service

// Create a New Service Route
router.post('/', authMiddleware, createService);

// Update a Service Route
router.put('/:id', authMiddleware, validateObjectId, updateService); // Validate ID before updating

// Delete a Service Route
router.delete('/:id', authMiddleware, validateObjectId, deleteService); // Validate ID before deleting

export default router;
