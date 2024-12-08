import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/shoppingListApp';
    await mongoose.connect(uri); 
    console.log('MongoDB connected!');
  } catch (err) {
    console.error('Failed to connect MongoDB:', err);
    process.exit(1); 
  }
};

export default connectDB;
