import { Router, Request, Response, NextFunction } from 'express';
import * as MechanicController from '../controllers/mechanicController'; 
import authMiddleware from '../middleware/authMiddleware';
import { validateObjectId } from '../middleware/validateObjectId';
import { sendErrorResponse } from '../utils/responseUtil';

const router = Router();

// Centralized async handler
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction): Promise<void> =>
    Promise.resolve(fn(req, res, next)).catch((error) => {
        sendErrorResponse(res, 500, 'An unexpected error occurred.');
        next(error);
    });

// Get all Mechanics Route
router.get('/', asyncHandler(MechanicController.getAllMechanics));

// Get Mechanic by ID Route
router.get('/:id', validateObjectId, asyncHandler(MechanicController.getMechanicProfile));

// Create a New Mechanic Route
router.post('/', authMiddleware, asyncHandler(MechanicController.addMechanic));

// Update a Mechanic Route
router.put('/:id', authMiddleware, validateObjectId, asyncHandler(MechanicController.updateMechanicProfile));

// Delete a Mechanic Route
router.delete('/:id', authMiddleware, validateObjectId, asyncHandler(MechanicController.deleteMechanicAccount));

export default router;
