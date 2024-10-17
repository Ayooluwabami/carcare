import { Response } from 'express';

interface ResponseData<T = any> {
    message: string;
    data?: T;
    error?: string;
}

// Utility function to send success responses
export const sendSuccessResponse = <T>(res: Response, statusCode: number, message: string, data?: T) => {
    res.status(statusCode).json({
        success: true,
        status: 'success',
        message,
        data
    });
};

// Utility function to send error responses
export const sendErrorResponse = (res: Response, statusCode: number, message: string): void => {
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: message || 'An unexpected error occurred',
    });
};
