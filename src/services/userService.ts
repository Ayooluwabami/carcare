import User, { IUser } from '../models/userModel';
import { IUpdateUserInput } from '../interfaces/updateUserInterface';
import { Types, Document } from 'mongoose';

// Get a user by ID
export const getUserById = async (userId: string): Promise<IUser & Document | null> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  return await User.findById(userId).exec();
};

// Update user profile
export const updateUser = async (userId: string, updateData: IUpdateUserInput): Promise<IUser & Document | null> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  return await User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
};

// Delete a user
export const deleteUser = async (userId: string): Promise<IUser & Document | null> => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
  return await User.findByIdAndDelete(userId).exec();
};

// Get all users (optional, based on your requirements)
export const getAllUsers = async (): Promise<(IUser & Document)[]> => {
  return await User.find().exec();
};
