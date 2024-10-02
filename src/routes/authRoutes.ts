import { Router, Request, Response, NextFunction } from 'express';
import { validateUserRegistration, validateUserLogin } from '../utils/validator';
import { registerUser, loginUser, logoutUser, refreshToken } from '../controllers/authController';

const router = Router();

// Helper function to wrap validation middlewares
const wrapValidation = (validation: any) => (req: Request, res: Response, next: NextFunction) => {
  validation(req, res, next);
};

// User Registration Route
router.post('/register', 
  wrapValidation(validateUserRegistration), 
  async (req: Request, res: Response) => {
    try {
      await registerUser(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: (error as Error).message });
    }
});

// User Login Route
router.post('/login', 
  wrapValidation(validateUserLogin), 
  async (req: Request, res: Response) => {
    try {
      await loginUser(req, res);
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: (error as Error).message });
    }
});

// User Logout Route
router.post('/logout', async (req: Request, res: Response) => {
  try {
    await logoutUser(req, res);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: (error as Error).message });
  }
});

// Refresh Token Route
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    await refreshToken(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Token refresh failed', error: (error as Error).message });
  }
});

export default router;
