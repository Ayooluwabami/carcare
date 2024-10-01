import mongoose, { Document, Schema } from 'mongoose';

// Define the Mechanic interface extending Mongoose Document
export interface Mechanic extends Document {
  userId: mongoose.Types.ObjectId; // Reference to the user
  specialization: string;          // Mechanic's specialization
  experienceYears: number;         // Years of experience
  available: boolean;              // Availability status
  createdAt?: Date;                // Creation timestamp
  updatedAt?: Date;                // Update timestamp
}

// Create the Mechanic schema
const mechanicSchema: Schema<Mechanic> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, // Correctly using Schema.Types.ObjectId
      required: true,
      ref: 'User', // Reference to the User model
      validate: {
        validator: (value: mongoose.Types.ObjectId) => {
          return mongoose.Types.ObjectId.isValid(value);
        },
        message: 'Invalid user ID',
      },
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: true,
      min: [0, 'Experience years must be a non-negative number'], // Custom error message
    },
    available: {
      type: Boolean,
      default: true, // Default to available
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Optional: Add pre-save hook to validate experienceYears
mechanicSchema.pre<Mechanic>('save', function(next) {
  // `this` is of type Mechanic now
  if (this.experienceYears < 0) {
    return next(new Error('Experience years cannot be negative.'));
  }
  next();
});

// Create the Mechanic model
const MechanicModel = mongoose.model<Mechanic>('Mechanic', mechanicSchema);

export default MechanicModel;
