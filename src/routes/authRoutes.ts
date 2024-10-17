import { Router, Request, Response } from 'express';
import { validateUserRegistration } from '../middleware/validateUserRegistration';
import { validateUserLogin } from '../middleware/validateUserLogin';
import { registerUser, loginUser, refreshToken } from '../controllers/authController';
import { sendErrorResponse, sendSuccessResponse } from '../utils/responseUtil';

const router = Router();

// Centralized async handler
const asyncHandler = (fn: Function) => (req: Request, res: Response) =>
  Promise.resolve(fn(req, res)).catch((error) => sendErrorResponse(res, 500, error.message));

// User Registration Route
router.post('/register', validateUserRegistration, asyncHandler(registerUser));

// User Login Route
router.post('/login', validateUserLogin, asyncHandler(loginUser));

// Refresh Token Route
router.post('/refresh-token', async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return sendErrorResponse(res, 400, 'Token is required');
  }

  try {
    const newToken = await refreshToken(token, res);
    sendSuccessResponse(res, 200, 'Token refreshed successfully', { token: newToken });
  } catch (error) {
    sendErrorResponse(res, 500, 'Token refresh failed');
  }
});

export default router;
