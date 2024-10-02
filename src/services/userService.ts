import { User } from '../models/userModel';
import { IUpdateUserInput } from '../interfaces/updateUserInterface'; // Define your own interface for the update input
import { Types } from 'mongoose';

// Get a user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  return await User.findById(userId).exec();
};

// Update user profile
export const updateUser = async (userId: string, updateData: IUpdateUserInput): Promise<User | null> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  return await User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
};

// Delete a user
export const deleteUser = async (userId: string): Promise<User | null> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  return await User.findByIdAndDelete(userId).exec();
};

// Get all users (optional, based on your requirements)
export const getAllUsers = async (): Promise<User[]> => {
  return await User.find().exec();
};
