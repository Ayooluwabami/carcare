import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const dbURI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/carcare';

    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI is not defined, using default: mongodb://localhost:27017/carcare');
    }

    await mongoose.connect(dbURI);

    console.log('MongoDB connected successfully.');
  } catch (error: any) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
