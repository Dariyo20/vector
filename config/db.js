const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const DB = process.env.MONGO_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB)
    .then(() => console.log(`MongoDB Connected successfully`))

  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
}; 

module.exports = connectDB;