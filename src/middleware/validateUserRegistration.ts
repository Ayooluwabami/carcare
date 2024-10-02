import { check, validationResult } from 'express-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validateUserRegistration: RequestHandler[] = [
  check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
  check('email').isEmail().withMessage('Enter a valid email.'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.'),
  
  // Middleware to handle validation results
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  }
];



