import { Router, Request, Response } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from '../controllers/userController'; // Import the controllers
import authMiddleware from '../middleware/authMiddleware'; 

const router = Router();

// Route to get the user's profile
router.get('/profile', authMiddleware, getUserProfile);

// Route to update the user's profile
router.put('/profile', authMiddleware, updateUserProfile);

// Route to delete the user account
router.delete('/profile', authMiddleware, deleteUser);

export default router;
