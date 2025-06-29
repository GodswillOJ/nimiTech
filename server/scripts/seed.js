const dotenv = require("dotenv");
const connectDB = require("../config/db");
const { seedDatabase } = require("../utils/seedDatabase");

// Load environment variables
dotenv.config();

const runSeeding = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to database");

    console.log("Starting seeding process...");
    await seedDatabase();

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

runSeeding();
