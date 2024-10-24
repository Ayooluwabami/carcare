import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User interface extending Mongoose Document
export interface IUser extends Document {
  email: string;
  password: string;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt?: Date;
  username: string; 
}

// Create the User schema
const userSchema: Schema<IUser> = new Schema(
  {
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
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Extract username from email and hash password before saving the user
userSchema.pre<IUser>('save', async function (next) {
  // Derive username from the email address
  this.username = this.email.split('@')[0]; 

  // Check if password is modified and hash it
  if (this.isModified('password')) {
    this.password = await hashPassword(this.password);
  }

  next();
});

// Method to hash the password
const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Method to compare password
userSchema.methods.comparePassword = async function (this: IUser, candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create the User model
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
