import { Router } from 'express';
import {
  getAllMechanics,
  getMechanicProfile,  
  addMechanic,          
  updateMechanicProfile,
  deleteMechanicAccount  
} from '../controllers/mechanicController'; 
import authMiddleware from '../middleware/authMiddleware';
import { validateObjectId } from '../middleware/validateObjectId';

const router = Router();

// Centralized route error handling with async wrapper (optional improvement)
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Get all Mechanics Route
router.get('/', asyncHandler(getAllMechanics));

// Get Mechanic by ID Route
router.get('/:id', validateObjectId, asyncHandler(getMechanicProfile)); 

// Create a New Mechanic Route
router.post('/', authMiddleware, asyncHandler(addMechanic));

// Update a Mechanic Route
router.put('/:id', authMiddleware, validateObjectId, asyncHandler(updateMechanicProfile)); 

// Delete a Mechanic Route
router.delete('/:id', authMiddleware, validateObjectId, asyncHandler(deleteMechanicAccount));

export default router;
