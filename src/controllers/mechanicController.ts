import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as MechanicService from '../services/mechanicService'; 
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtil';
import logger from '../utils/logger';

interface AddMechanicRequestBody {
    userId: string;
    specialization: string;
    experienceYears?: number;
    available?: boolean;
}

// Add a new mechanic
export const addMechanic = async (req: Request<{}, {}, AddMechanicRequestBody>, res: Response, next: NextFunction): Promise<void> => {
    const { userId, specialization, experienceYears, available } = req.body;

    try {
        if (!userId || !specialization) {
            return sendErrorResponse(res, 400, 'User ID and specialization are required.');
        }

        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return sendErrorResponse(res, 400, 'Invalid User ID format.');
        }

        const newMechanic = await MechanicService.addMechanic({ userId: new mongoose.Types.ObjectId(userId), specialization, experienceYears, available });
        sendSuccessResponse(res, 201, 'Mechanic added successfully', newMechanic);
    } catch (error: any) {
        logger.error(`Error adding mechanic: ${error.message}`, { stack: error.stack });
        sendErrorResponse(res, error.status || 500, 'An error occurred while adding the mechanic.');
        next(error);
    }
};

// Get mechanic profile by ID
export const getMechanicProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.params.id;

    try {
        const mechanic = await MechanicService.getMechanicById(id);
        if (!mechanic) {
            return sendErrorResponse(res, 404, 'Mechanic not found.');
        }

        sendSuccessResponse(res, 200, 'Mechanic profile retrieved successfully', mechanic);
    } catch (error: any) {
        logger.error(`Error retrieving mechanic profile: ${error.message}`, { stack: error.stack });
        sendErrorResponse(res, error.status || 500, 'An error occurred while retrieving the mechanic profile.');
        next(error);
    }
};

// Update mechanic profile
export const updateMechanicProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const mechanicId = req.params.id;
    const { specialization, experienceYears, available } = req.body;

    try {
        const updatedMechanic = await MechanicService.updateMechanic(mechanicId, { specialization, experienceYears, available });
        if (!updatedMechanic) {
            return sendErrorResponse(res, 404, 'Mechanic not found.');
        }

        sendSuccessResponse(res, 200, 'Mechanic profile updated successfully', updatedMechanic);
    } catch (error: any) {
        logger.error(`Error updating mechanic profile: ${error.message}`, { stack: error.stack });
        sendErrorResponse(res, error.status || 500, 'An error occurred while updating the mechanic profile.');
        next(error);
    }
};

// Delete mechanic account
export const deleteMechanicAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.params.id;

    try {
        const deletedMechanic = await MechanicService.deleteMechanic(id);
        if (!deletedMechanic) {
            return sendErrorResponse(res, 404, 'Mechanic not found.');
        }

        sendSuccessResponse(res, 200, 'Mechanic account deleted successfully.');
    } catch (error: any) {
        logger.error(`Error deleting mechanic account: ${error.message}`, { stack: error.stack });
        sendErrorResponse(res, error.status || 500, 'An error occurred while deleting the mechanic account.');
        next(error);
    }
};

// Get all mechanics
export const getAllMechanics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const mechanics = await MechanicService.getAllMechanics();
        sendSuccessResponse(res, 200, 'Mechanics retrieved successfully', mechanics);
    } catch (error: any) {
        logger.error(`Error retrieving mechanics: ${error.message}`, { stack: error.stack });
        sendErrorResponse(res, error.status || 500, 'An error occurred while retrieving mechanics.');
        next(error);
    }
};
