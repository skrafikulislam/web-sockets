import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect("");
    console.log("Connected to the MongoDB database");
  } catch (error) {
    console.error("Failed to connect to the database: " + error);
  }
};

export default dbConnection;
