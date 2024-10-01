import { Request, Response } from 'express';
import User from '../models/userModel';

// Define an interface for the request body
interface UserProfileRequest extends Request {
  body: {
    username?: string; // Assuming these fields are optional
    email?: string;
  };
}

// Get user profile by ID
export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error: any) {
    console.error('Error fetching user profile:', error.message); // Log the error
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req: UserProfileRequest, res: Response) => {
  const userId = req.params.id;
  const { username, email } = req.body;

  try {
    // Input validation
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true } // Validate during updates
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user profile:', error.message); // Log the error
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete user account
export const deleteUserAccount = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user account:', error.message); // Log the error
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
