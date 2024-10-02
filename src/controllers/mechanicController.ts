import { Request, Response, NextFunction } from 'express';
import MechanicModel from '../models/mechanicModel'; 

// Add a new mechanic
export const addMechanic = async (req: Request, res: Response, next: NextFunction) => {
  const { userId, specialization, experienceYears, available } = req.body; 
  try {
    // Input validation (example)
    if (!userId || !specialization) {
      return res.status(400).json({ message: 'User ID and specialization are required.' });
    }

    const newMechanic = new MechanicModel({ userId, specialization, experienceYears, available });
    await newMechanic.save();
    return res.status(201).json(newMechanic);
  } catch (error: any) {
    next(error); // Pass errors to the error handling middleware
  }
};

// Get mechanic profile by ID
export const getMechanicProfile = async (req: Request, res: Response, next: NextFunction) => {
  const mechanicId = req.params.id;

  try {
    const mechanic = await MechanicModel.findById(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    return res.status(200).json(mechanic);
  } catch (error: any) {
    next(error); // Pass errors to the error handling middleware
  }
};

// Update mechanic profile
export const updateMechanicProfile = async (req: Request, res: Response, next: NextFunction) => {
  const mechanicId = req.params.id;
  const { specialization, experienceYears, available } = req.body; 

  try {
    const updatedMechanic = await MechanicModel.findByIdAndUpdate(
      mechanicId,
      { specialization, experienceYears, available },
      { new: true }
    );
    if (!updatedMechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    return res.status(200).json(updatedMechanic);
  } catch (error: any) {
    next(error); // Pass errors to the error handling middleware
  }
};

// Delete mechanic account
export const deleteMechanicAccount = async (req: Request, res: Response, next: NextFunction) => {
  const mechanicId = req.params.id;

  try {
    const deletedMechanic = await MechanicModel.findByIdAndDelete(mechanicId);
    if (!deletedMechanic) {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    return res.status(200).json({ message: 'Mechanic account deleted successfully' });
  } catch (error: any) {
    next(error); // Pass errors to the error handling middleware
  }
};

// Get all mechanics
export const getAllMechanics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mechanics = await MechanicModel.find();
    res.status(200).json(mechanics);
  } catch (error: any) {
    next(error); // Pass errors to the error handling middleware
  }
};
