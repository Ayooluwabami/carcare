import { Service } from '../models/serviceModel';
import { IUpdateServiceInput } from '../interfaces/updateServiceInterface'; 
import { Types } from 'mongoose';

// Get a service by ID
export const getServiceById = async (serviceId: string): Promise<Service | null> => {
  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error('Invalid service ID');
  }
  return await Service.findById(serviceId).exec();
};

// Add a new service
export const addService = async (serviceData: Partial<Service>): Promise<Service> => {
  const newService = new Service(serviceData);
  return await newService.save();
};

// Update service details
export const updateService = async (serviceId: string, updateData: IUpdateServiceInput): Promise<Service | null> => {
  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error('Invalid service ID');
  }
  return await Service.findByIdAndUpdate(serviceId, updateData, { new: true }).exec();
};

// Delete a service
export const deleteService = async (serviceId: string): Promise<Service | null> => {
  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error('Invalid service ID');
  }
  return await Service.findByIdAndDelete(serviceId).exec();
};

// Get all services (optional, based on your requirements)
export const getAllServices = async (): Promise<Service[]> => {
  return await Service.find().exec();
};
