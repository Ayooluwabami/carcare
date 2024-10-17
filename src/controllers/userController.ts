import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtil';

// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            sendErrorResponse(res, 404, 'User not found');
            return;
        }
        sendSuccessResponse(res, 200, 'User profile retrieved successfully', { user });
    } catch (error: any) {
        sendErrorResponse(res, error.status || 500, 'Failed to retrieve user profile');
    }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    const { username, email, password } = req.body;

    try {
        if (!username || !email) {
            sendErrorResponse(res, 400, 'Username and email are required.');
            return;
        }

        // Pass only the necessary fields
        const updatedUser = await userService.updateUser(userId, { username, email, password });
        if (!updatedUser) {
            sendErrorResponse(res, 404, 'User not found');
            return;
        }

        sendSuccessResponse(res, 200, 'User profile updated successfully', { user: updatedUser });
    } catch (error: any) {
        sendErrorResponse(res, error.status || 500, 'Failed to update user profile');
    }
};

// Delete user account
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
        const deletedUser = await userService.deleteUser(userId);
        if (!deletedUser) {
            sendErrorResponse(res, 404, 'User not found');
            return;
        }

        sendSuccessResponse(res, 200, 'User account deleted successfully');
    } catch (error: any) {
        sendErrorResponse(res, error.status || 500, 'Failed to delete user account');
    }
};
