import { Request, Response } from 'express';
import UserModel from '../models/userModel'; // Adjust the path as needed

// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.userId; // Extract userId from the request

  try {
    const user = await UserModel.findById(userId).select('-password'); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req: Request, res: Response) => {
  const userId = req.userId; // Extract userId from the request
  const updates = req.body;

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true }).select('-password'); // Exclude password
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user account
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.userId; // Extract userId from the request

  try {
    const deletedUser = await UserModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
