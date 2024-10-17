import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Utility function to handle errors
const sendErrorResponse = (res: Response, statusCode: number, message: string, error?: string) => {
  console.error(error); // Log the error for debugging
  res.status(statusCode).json({ message, error });
};

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendErrorResponse(res, 400, 'User already exists');
      return;
    }

    const newUser = new User({ username, email, password });

    const savedUser = await newUser.save(); 

    // Log the saved user object
    console.log('User saved successfully:', savedUser);

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: newUser._id, username, email } });
  } catch (error: any) {
    sendErrorResponse(res, 500, 'Server error', error.message);
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      sendErrorResponse(res, 400, 'User not found');
      return;
    }

    const trimmedPassword = password.trim();

    // Compare the entered password with the stored hash
    const isMatch = await bcrypt.compare(trimmedPassword, user.password);

    if (!isMatch) {
      sendErrorResponse(res, 400, 'Incorrect password');
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { id: user._id, username: user.username, email } });
  } catch (error: any) {
    sendErrorResponse(res, 500, 'Server error', error.message);
  }
};

// Refresh token function
export const refreshToken = async (token: string): Promise<string> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1h' });
  } catch (error: any) {
    throw new Error('Invalid or expired token');
  }
};
