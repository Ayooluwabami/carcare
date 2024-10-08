import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Function to handle validation results
const handleValidationResult = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Middleware for validating user registration input
export const validateUserRegistration = [
  body('username')
    .isString()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters long.'),
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address.'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  handleValidationResult, 
];

// Middleware for validating user login input
export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address.'),
  body('password')
    .isString()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  handleValidationResult, 
];
