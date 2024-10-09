import { Request, Response } from 'express';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return; 
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h', 
    });

    res.status(201).json({ token, user: { id: newUser._id, username, email } });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return; 
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Incorrect password' });
      return; 
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h', 
    });

    res.status(200).json({ token, user: { id: user._id, username: user.username, email } });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Logout a user (invalidates the token)
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'Logout successful' });
};

// Refresh token
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(401).json({ message: 'Token is required' });
    return; 
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: 'Invalid token' });
      return; 
    }

    // Generate a new token
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h', 
    });

    res.status(200).json({ token: newToken });
  });
};
