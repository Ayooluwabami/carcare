import { Request, Response, NextFunction, RequestHandler } from 'express';
import Service from '../models/serviceModel';

// Define an interface for the request body
interface ServiceRequest extends Request {
  body: {
    name: string;
    description: string;
    price: number;
    duration: number; 
  };
}

// Add a new service
export const createService = async (req: ServiceRequest, res: Response): Promise<void> => {
  const { name, description, price, duration } = req.body;

  try {
    // Input validation
    if (!name || !description || !price || !duration) {
      res.status(400).json({ message: 'All fields are required.' });
      return; 
    }

    const newService = new Service({ name, description, price, duration });
    await newService.save();
    res.status(201).json({ service: newService });
  } catch (error: any) {
    console.error('Error adding service:', error.message); 
    res.status(500).json({ message: 'Server error', error: error.message }); 
  }
};

// Get service details by ID
export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  const serviceId = req.params.id;

  try {
    const service = await Service.findById(serviceId);
    
    if (!service) {
      res.status(404).json({ message: 'Service not found' });
      return;
    }

    res.status(200).json({ service });
  } catch (error: any) {
    console.error('Error fetching service details:', error.message); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update service information
export const updateService = async (req: ServiceRequest, res: Response): Promise<void> => {
  const serviceId = req.params.id;
  const { name, description, price, duration } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { name, description, price, duration },
      { new: true, runValidators: true } // Ensures validation on updates
    );
    if (!updatedService) {
      res.status(404).json({ message: 'Service not found' });
      return; // Exit the function after sending the response
    }
    
    res.status(200).json({ service: updatedService });
  } catch (error: any) {
    console.error('Error updating service:', error.message); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete service
export const deleteService: RequestHandler = async (req, res) => {
  const serviceId = req.params.id;

  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService) {
      res.status(404).json({ message: 'Service not found' });
      return; // Exit after sending response
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting service:', error.message); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all services
export const getAllServices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await Service.find({});
    res.status(200).json({ services });
  } catch (error: any) {
    console.error('Error fetching all services:', error.message);
    next(error);
  }
};