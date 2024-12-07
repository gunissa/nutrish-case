// Import necessary modules
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { connectToDB } from "./db";

// Use Puppeteer Stealth plugin to bypass bot detection
puppeteer.use(StealthPlugin());

// Function to fetch data from the target website
const fetchData = async (query: string): Promise<string> => {
  try {
    console.log(`Fetching data for query: ${query} using Puppeteer...`);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const url = `https://examine.com/supplements/${query}`;
    console.log(`Navigating to URL: ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const data = await page.content();
    console.log("Fetched data successfully.");
    await browser.close();
    return data;
  } catch (error) {
    console.error("Error fetching data with Puppeteer:", error);
    throw error;
  }
};

// Function to save the fetched data to MongoDB
const saveToDatabase = async (query: string, data: string) => {
  try {
    console.log("Connecting to MongoDB...");
    const db = await connectToDB();
    const collection = db.collection("supplements");

    const result = await collection.insertOne({ query, data });
    console.log("Data saved to MongoDB successfully with ID:", result.insertedId);
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    throw error;
  }
};

// Main function to handle the script logic
(async () => {
  const query = process.argv[2]; // Get the query from the command-line argument
  if (!query) {
    console.error("Please provide a query as a command-line argument.");
    process.exit(1);
  }

  try {
    console.log("Starting the data fetching process...");
    const data = await fetchData(query);

    console.log("Saving fetched data to MongoDB...");
    await saveToDatabase(query, data);

    console.log("Process completed successfully.");
  } catch (error) {
    console.error("An error occurred during execution:", error);
    process.exit(1);
  }
})();
