import { Request, Response } from 'express';
import * as serviceService from '../services/serviceService'; 
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtil';

// Add a new service
export const createService = async (req: Request, res: Response): Promise<void> => {
    const serviceData = req.body;

    try {
        const newService = await serviceService.addService(serviceData);
        sendSuccessResponse(res, 201, 'Service created successfully', newService);
    } catch (error: any) {
        sendErrorResponse(res, error.status || 400, 'Failed to create service');
    }
};

// Get all services
export const getAllServices = async (req: Request, res: Response): Promise<void> => {
    try {
        const services = await serviceService.getAllServices();
        sendSuccessResponse(res, 200, 'Services retrieved successfully', services);
    } catch (error: any) {
        sendErrorResponse(res, error.status || 500, 'Failed to retrieve services');
    }
};

// Get service details by ID
export const getServiceById = async (req: Request, res: Response): Promise<void> => {
    const serviceId = req.params.id;

    try {
        const service = await serviceService.getServiceById(serviceId);
        if (!service) {
            sendErrorResponse(res, 404, 'Service not found');
            return;
        }

        sendSuccessResponse(res, 200, 'Service details retrieved successfully', service);
    } catch (error: any) {
        sendErrorResponse(res, error.status || 500, 'Failed to retrieve service details');
    }
};

// Update service details
export const updateService = async (req: Request, res: Response): Promise<void> => {
    const serviceId = req.params.id;
    const updateData = req.body;

    try {
        const updatedService = await serviceService.updateService(serviceId, updateData);
        if (!updatedService) {
            sendErrorResponse(res, 404, 'Service not found');
            return;
        }

        sendSuccessResponse(res, 200, 'Service updated successfully', updatedService);
    } catch (error: any) {
        sendErrorResponse(res, error.status || 500, 'Failed to update service');
    }
};

// Delete service
export const deleteService = async (req: Request, res: Response): Promise<void> => {
    const serviceId = req.params.id;

    try {
        const deletedService = await serviceService.deleteService(serviceId);
        if (!deletedService) {
            sendErrorResponse(res, 404, 'Service not found');
            return;
        }

        sendSuccessResponse(res, 200, 'Service deleted successfully');
    } catch (error: any) {
        sendErrorResponse(res, error.status || 500, 'Failed to delete service');
    }
};
