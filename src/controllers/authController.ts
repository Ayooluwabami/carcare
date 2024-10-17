// controllers/authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtil';

const authService = new AuthService();

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await authService.registerUser(req.body);
        sendSuccessResponse(res, 201, 'User registered successfully', result);
    } catch (error: any) {
        sendErrorResponse(res, error.status || 500, error.message);
    }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await authService.loginUser(req.body);
        sendSuccessResponse(res, 200, 'User logged in successfully', result);
    } catch (error: any) {
        sendErrorResponse(res, 401, 'Invalid login'); // Generic login error for security
    }
};

// Refresh token function
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;
    try {
        const newToken = await authService.refreshToken(token);
        sendSuccessResponse(res, 200, 'Token refreshed successfully', { token: newToken });
    } catch (error: any) {
        sendErrorResponse(res, error.status || 500, error.message);
    }
};
