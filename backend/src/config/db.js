const mongoose = require('mongoose');

// MongoDB connection string
// Replace with your actual MongoDB URI when you have Node.js installed
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bobfirstwebapp';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

// Made with Bob
