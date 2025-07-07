// mongoose
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load .env variables
dotenv.config({ path: __dirname + "/../.env" });

const dbURL = process.env.DB_URL;

const connectDB = async () => {
  try {
    mongoose.connect(dbURL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection faild:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
