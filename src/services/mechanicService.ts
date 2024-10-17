import Mechanic, { IMechanic as MechanicType } from '../models/mechanicModel';
import { IUpdateMechanicInput } from '../interfaces/updateMechanicInterface';
import { Types, Document } from 'mongoose';

// Get a mechanic by ID
export const getMechanicById = async (mechanicId: string): Promise<(MechanicType & Document) | null> => {
    if (!Types.ObjectId.isValid(mechanicId)) {
        throw { status: 400, message: 'Invalid mechanic ID' }; 
    }
    return await Mechanic.findById(mechanicId).exec();
};

// Add a new mechanic
export const addMechanic = async (mechanicData: Partial<MechanicType>): Promise<MechanicType & Document> => {
    const newMechanic = new Mechanic(mechanicData);
    return await newMechanic.save();
};

// Update mechanic profile
export const updateMechanic = async (mechanicId: string, updateData: IUpdateMechanicInput): Promise<(MechanicType & Document) | null> => {
    if (!Types.ObjectId.isValid(mechanicId)) {
        throw { status: 400, message: 'Invalid mechanic ID' }; 
    }
    return await Mechanic.findByIdAndUpdate(mechanicId, updateData, { new: true }).exec();
};

// Delete a mechanic
export const deleteMechanic = async (mechanicId: string): Promise<(MechanicType & Document) | null> => {
    if (!Types.ObjectId.isValid(mechanicId)) {
        throw { status: 400, message: 'Invalid mechanic ID' }; 
    }
    return await Mechanic.findByIdAndDelete(mechanicId).exec();
};

// Get all mechanics 
export const getAllMechanics = async (): Promise<(MechanicType & Document)[]> => {
    return await Mechanic.find().exec();
};
