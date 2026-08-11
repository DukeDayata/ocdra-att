import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/att_db');
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] ${error.message}`);
    // In production/dev retry or exit
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};
