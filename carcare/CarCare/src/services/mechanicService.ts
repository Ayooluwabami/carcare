import { Mechanic } from '../models/mechanicModel';
import { IUpdateMechanicInput } from '../interfaces/updateMechanicInterface'; 
import { Types } from 'mongoose';

// Get a mechanic by ID
export const getMechanicById = async (mechanicId: string): Promise<Mechanic | null> => {
  if (!Types.ObjectId.isValid(mechanicId)) {
    throw new Error('Invalid mechanic ID');
  }
  return await Mechanic.findById(mechanicId).exec();
};

// Add a new mechanic
export const addMechanic = async (mechanicData: Partial<Mechanic>): Promise<Mechanic> => {
  const newMechanic = new Mechanic(mechanicData);
  return await newMechanic.save();
};

// Update mechanic profile
export const updateMechanic = async (mechanicId: string, updateData: IUpdateMechanicInput): Promise<Mechanic | null> => {
  if (!Types.ObjectId.isValid(mechanicId)) {
    throw new Error('Invalid mechanic ID');
  }
  return await Mechanic.findByIdAndUpdate(mechanicId, updateData, { new: true }).exec();
};

// Delete a mechanic
export const deleteMechanic = async (mechanicId: string): Promise<Mechanic | null> => {
  if (!Types.ObjectId.isValid(mechanicId)) {
    throw new Error('Invalid mechanic ID');
  }
  return await Mechanic.findByIdAndDelete(mechanicId).exec();
};

// Get all mechanics (optional, based on your requirements)
export const getAllMechanics = async (): Promise<Mechanic[]> => {
  return await Mechanic.find().exec();
};
