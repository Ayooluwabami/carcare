import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import { Request } from 'express';
import { ILoginResponse } from '../interfaces/loginResponseInterface'; // Define your own interface for the login response

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable for security

// Register a new user
export const registerUser = async (email: string, password: string): Promise<User> => {
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

// Logout a user
export const logoutUser = (req: Request): void => {
  req.logout((err) => {
    if (err) throw new Error('Logout failed');
  });
};

// Refresh token
export const refreshToken = (token: string): string => {
  const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
  return jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: '1h' });
};
