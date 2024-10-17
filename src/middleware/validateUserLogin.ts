import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validateUserLogin: RequestHandler[] = [
  check('email').isEmail().withMessage('Enter a valid email.'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),
  
  // Middleware to handle validation results
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }
    next(); // Proceed if there are no validation errors
  }
];
