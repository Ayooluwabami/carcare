import mongoose, { Document, Schema } from 'mongoose';

// Define the Service interface extending Mongoose Document
export interface Service extends Document {
  mechanicId: mongoose.Types.ObjectId; // Reference to the mechanic
  name: string;                         // Name of the service
  description: string;                  // Description of the service
  price: number;                        // Price of the service
  duration: number;                     // Duration of the service in minutes
  createdAt?: Date;                     // Creation timestamp
  updatedAt?: Date;                     // Update timestamp
}

// Create the Service schema
const serviceSchema: Schema<Service> = new Schema(
  {
    mechanicId: {
      type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId here
      required: true,
      ref: 'Mechanic', // Reference to the Mechanic model
      validate: {
        validator: (value: mongoose.Types.ObjectId) => {
          return mongoose.Types.ObjectId.isValid(value);
        },
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
      min: [0, 'Price must be a non-negative number'], // Custom error message
    },
    duration: {
      type: Number,
      required: true,
      min: [1, 'Duration must be at least 1 minute'], // Custom error message
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Create the Service model
const ServiceModel = mongoose.model<Service>('Service', serviceSchema);

export default ServiceModel;
