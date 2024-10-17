import mongoose, { Document, Schema } from 'mongoose';

// Define the Service interface extending Mongoose Document
export interface IService extends Document {
  mechanicId: mongoose.Types.ObjectId; 
  name: string;                       
  description: string;                
  price: number;                        
  duration: number;                    
  createdAt?: Date;                   
  updatedAt?: Date;                  
}

// Create the Service schema
const serviceSchema: Schema<IService> = new Schema(
  {
    mechanicId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Mechanic', // Reference to the Mechanic model
      validate: {
        validator: (value: mongoose.Types.ObjectId) => mongoose.Types.ObjectId.isValid(value),
        message: 'Invalid mechanic ID',
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => value >= 0,
        message: 'Price must be a non-negative number.',
      },
    },
    duration: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => value >= 1,
        message: 'Duration must be at least 1 minute.',
      },
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Create the Service model
const ServiceModel = mongoose.model<IService>('Service', serviceSchema);

export default ServiceModel;
