// Import required modules
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load environment variables from the .env file
dotenv.config();

// Load MongoDB connection string from environment variable
const uri = process.env.MONGO_URI || "";

// Validate the MongoDB connection string
if (!uri) {
  console.error("MONGO_URI environment variable is not set.");
  process.exit(1); // Exit if the connection string is missing
}

// Initialize a new MongoClient instance
const client = new MongoClient(uri);

// Function to connect to MongoDB
export const connectToDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await client.connect();
    console.log("Connected to MongoDB successfully.");
    return client.db("NutrishCase"); // Return the specified database
  } catch (error) {
    console.error("MongoDB connection error:", error instanceof Error ? error.message : error);
    throw error; // Rethrow the error to handle in the caller
  }
};
