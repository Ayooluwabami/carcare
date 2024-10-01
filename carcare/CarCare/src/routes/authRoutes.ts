import { Router } from 'express';
import { validateUserRegistration, validateUserLogin } from '../utils/validator';
import { registerUser, loginUser, logoutUser, refreshToken } from '../controllers/authController';

const router = Router();

// User Registration Route
router.post('/register', validateUserRegistration, registerUser);

// User Login Route
router.post('/login', validateUserLogin, loginUser);

// User Logout Route
router.post('/logout', logoutUser);

// Refresh Token Route
router.post('/refresh-token', refreshToken);

export default router;
