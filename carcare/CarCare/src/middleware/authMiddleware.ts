import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import logger from '../utils/logger';

// Extend the Request interface to include userId
interface AuthenticatedRequest extends Request {
  userId?: string;
}

// Middleware to authenticate users using JWT
const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    logger.error('Authorization header is missing or malformed.');
    return res.status(403).json({ message: 'No token provided.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error('JWT secret is not defined.');
    return res.status(500).json({ message: 'Server error: JWT secret is not defined.' });
  }

  // Verify the token
  jwt.verify(token, secret, (err: VerifyErrors | null, decoded?: JwtPayload) => {
    if (err) {
        logger.error('Failed to authenticate token.', { error: err.message });
        return res.status(401).json({ message: 'Failed to authenticate token.' });
    }

    // Attach user ID to the request object for later use
    if (decoded && typeof decoded.id === 'string') {
      req.userId = decoded.id; // Ensure decoded.id is a string
    } else {
      logger.warn('Decoded token did not contain a valid ID.');
      return res.status(401).json({ message: 'Token is invalid.' });
    }

    next(); // Proceed to the next middleware or route handler
  });
};

export default authMiddleware;
