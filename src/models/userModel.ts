import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User interface extending Mongoose Document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
}

// Create the User schema
const userSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, 'Please enter a valid email address'], // Regex for email validation
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    firstName: {
      type: String,
      trim: true,
      default: null,
    },
    lastName: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

// Hash the password before saving the user
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await hashPassword(this.password);
  next();
});

// Method to hash the password
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Method to compare password
userSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed.');
  }
};

// Create the User model
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
