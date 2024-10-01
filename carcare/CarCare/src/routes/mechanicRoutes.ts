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

// Get all Mechanics Route
router.get('/', getAllMechanics);

// Get Mechanic by ID Route
router.get('/:id', validateObjectId, getMechanicProfile); 

// Create a New Mechanic Route
router.post('/', authMiddleware, addMechanic);

// Update a Mechanic Route
router.put('/:id', authMiddleware, validateObjectId, updateMechanicProfile); 

// Delete a Mechanic Route
router.delete('/:id', authMiddleware, validateObjectId, deleteMechanicAccount);

export default router;
