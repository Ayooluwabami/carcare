import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';
import { ILoginResponse } from '../interfaces/loginResponseInterface';
import { Document } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 

// Register a new user
export const registerUser = async (email: string, password: string): Promise<IUser & Document> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  return await newUser.save();
};

// Login a user
export const loginUser = async (email: string, password: string): Promise<ILoginResponse> => {
  const user = await User.findOne({ email }).exec();
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  return { user, token };
};

// Refresh token
export const refreshToken = (token: string): string => {
  const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
  return jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1h' });
};
