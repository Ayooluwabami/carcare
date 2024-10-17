import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  const dbURI: string = process.env.MONGODB_URI || ''; 

  // Check if MONGODB_URI is set
  if (!dbURI) {
    throw new Error('MongoDB connection URI not provided');
  }

  try {
    await mongoose.connect(dbURI);
  } catch (error: any) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

export default connectDB;
