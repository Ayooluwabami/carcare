import Service, { IService } from '../models/serviceModel';
import { IUpdateServiceInput } from '../interfaces/updateServiceInterface';
import { Types, Document } from 'mongoose';

// Get a service by ID
export const getServiceById = async (serviceId: string): Promise<(IService & Document) | null> => {
  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error('Invalid service ID');
  }
  return await Service.findById(serviceId).exec();
};

// Add a new service
export const addService = async (serviceData: Partial<IService>): Promise<IService & Document> => {
  const newService = new Service(serviceData);
  return await newService.save();
};

// Update service details
export const updateService = async (serviceId: string, updateData: IUpdateServiceInput): Promise<(IService & Document) | null> => {
  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error('Invalid service ID');
  }
  return await Service.findByIdAndUpdate(serviceId, updateData, { new: true }).exec();
};

// Delete a service
export const deleteService = async (serviceId: string): Promise<(IService & Document) | null> => {
  if (!Types.ObjectId.isValid(serviceId)) {
    throw new Error('Invalid service ID');
  }
  return await Service.findByIdAndDelete(serviceId).exec();
};

// Get all services (optional, based on your requirements)
export const getAllServices = async (): Promise<(IService & Document)[]> => {
  return await Service.find().exec();
};
