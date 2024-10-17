import { Router, Request, Response, NextFunction } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';
import { sendErrorResponse } from '../utils/responseUtil'; 

const router = Router();

// Centralized async handler
const asyncHandler = (fn: Function) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    const err = error as Error;
    sendErrorResponse(res, 500, err.message);
    next(error);
  }
};

// Route to get the user's profile
router.get('/profile', authMiddleware, asyncHandler(getUserProfile));

// Route to update the user's profile
router.put('/profile', authMiddleware, asyncHandler(updateUserProfile));

// Route to delete the user account
router.delete('/profile', authMiddleware, asyncHandler(deleteUser));

export default router;
