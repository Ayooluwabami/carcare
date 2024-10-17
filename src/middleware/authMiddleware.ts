import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'; 
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
  userId?: string; 
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    logger.error('Authorization header is missing or malformed.');
    res.status(403).json({ message: 'No token provided.' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    logger.error('JWT secret is not defined.');
    res.status(500).json({ message: 'Server error: JWT secret is not defined.' });
    return;
  }

  jwt.verify(token, secret, { algorithms: ['HS256'] }, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err) {
      logger.error('Failed to authenticate token.', { error: err.message });
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }

    if (decoded && typeof decoded === 'object' && 'id' in decoded) {
      req.userId = decoded.id; // Assign the userId to the request
      return next(); // Pass control to the next middleware/handler
    } else {
      logger.warn('Decoded token did not contain an ID.');
      return res.status(401).json({ message: 'Token is invalid.' });
    }
  });
};

export default authMiddleware;
