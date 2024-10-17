import { body, validationResult } from 'express-validator';
import { RequestHandler } from 'express';

// Validation Middleware for Service Input
export const validateServiceInput: RequestHandler[] = [
  body('name').isString().withMessage('Name must be a string'),
  body('description').isString().withMessage('Description must be a string'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('duration').isNumeric().withMessage('Duration must be a number'),
  (req, res, next) => {
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
  },
];
