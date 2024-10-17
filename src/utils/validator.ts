import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../utils/responseUtil';

// Middleware for validating user registration input
export const validateUserRegistration: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address.'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
];

// Middleware for validating user login input
export const validateUserLogin: ValidationChain[] = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address.'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
];

// Function to handle validation results and send error responses
const handleValidationResult = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Validation failed',
        errors: errors.array(),
    });
  }
  next();
};

// Exporting the validation result handler
export const validateUserRegistrationResult = handleValidationResult;
export const validateUserLoginResult = handleValidationResult;
