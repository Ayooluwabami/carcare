import mongoose, { Document, Schema } from 'mongoose';

// Define the Mechanic interface extending Mongoose Document
export interface IMechanic extends Document {
  userId: mongoose.Types.ObjectId; 
  specialization: string;           
  experienceYears: number;        
  available: boolean;             
  createdAt?: Date;               
  updatedAt?: Date;                
}

// Create the Mechanic schema
const mechanicSchema: Schema<IMechanic> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId, 
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
      validate: {
        validator: (value: number) => Number.isInteger(value) && value >= 0,
        message: 'Experience years must be a non-negative integer.',
      },
    },
    available: {
      type: Boolean,
      required: true, 
      default: true,   
    },
  },
  {
    timestamps: true, // Automatically create createdAt and updatedAt fields
  }
);

// Optional: Add pre-save hook to validate experienceYears
mechanicSchema.pre<IMechanic>('save', function(next) {
  if (this.experienceYears < 0) {
    return next(new Error('Experience years cannot be negative.'));
  }
  next();
});

// Create the Mechanic model
const MechanicModel = mongoose.model<IMechanic>('Mechanic', mechanicSchema);

export default MechanicModel;
