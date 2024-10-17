import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';
import { ILoginResponse } from '../interfaces/loginResponseInterface';
import { Document } from 'mongoose';
import { Request, Response } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 

// Register a new user
export const registerUser = async (email: string, password: string): Promise<IUser & Document> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    return await newUser.save();
  } catch (error) {
    console.error('Error registering user:', error); // Log registration errors
    throw new Error('Registration failed');
  }
};

// Login a user
export const loginUser = async (email: string, password: string): Promise<ILoginResponse> => {
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Incorrect password');
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    return { user, token };
  } catch (error) {
    console.error('Error during login:', error); // Log any error that occurs during login
    throw new Error('Login failed');
  }
};

// Refresh token
export const refreshToken = async (req: Request, _res: Response, token: string): Promise<string> => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    // Generate a new token with the same user ID
    return jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1h' });
  } catch (error) {
    console.error('Error refreshing token:', error); // Log token refresh errors
    throw new Error('Invalid token');
  }
};
