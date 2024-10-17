import { Router, Request, Response } from 'express';
import { validateUserRegistration } from '../middleware/validateUserRegistration';
import { validateUserLogin } from '../middleware/validateUserLogin';
import { registerUser, loginUser, refreshToken } from '../controllers/authController';

const router = Router();

// Utility function to send error responses
const sendErrorResponse = (res: Response, statusCode: number, message: string) => {
  res.status(statusCode).json({ message });
};

// User Registration Route
router.post('/register', 
  validateUserRegistration, 
  async (req: Request, res: Response) => {
    try {
      await registerUser(req, res);
    } catch (error) {
      sendErrorResponse(res, 500, 'Registration failed');
    }
  }
);

// User Login Route
router.post('/login', 
  validateUserLogin, 
  async (req: Request, res: Response) => {
    try {
      await loginUser(req, res);
    } catch (error) {
      sendErrorResponse(res, 500, 'Login failed');
    }
  }
);

// Refresh Token Route
router.post('/refresh-token', async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return sendErrorResponse(res, 400, 'Token is required');
  }

  try {
    const newToken = await refreshToken(token); 
    res.status(200).json({ token: newToken });
  } catch (error) {
    sendErrorResponse(res, 500, 'Token refresh failed');
  }
});

export default router;
