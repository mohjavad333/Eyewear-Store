import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User";
import { connectDB } from "../db";

dotenv.config();

async function seedDatabase() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Check if demo user exists
    const existingUser = await User.findOne({ email: "demo@example.com" });
    if (existingUser) {
      if (existingUser.role !== "admin") {
        existingUser.role = "admin";
        await existingUser.save();
        console.log("✓ Demo user promoted to admin");
      } else {
        console.log("Demo user already exists");
      }
      process.exit(0);
    }

    // Create demo user
    const demoUser = new User({
      firstName: "Demo",
      lastName: "User",
      email: "demo@example.com",
      password: "password123",
      role: "admin",
      phone: "+1 (555) 123-4567",
      addresses: [
        {
          type: "shipping",
          firstName: "Demo",
          lastName: "User",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zip: "10001",
          country: "USA",
          isDefault: true,
        },
      ],
    });

    await demoUser.save();
    console.log("✓ Demo user created successfully");
    console.log("  Email: demo@example.com");
    console.log("  Password: password123");

    // Create additional test user
    const testUser = new User({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "TestPassword123",
      phone: "+1 (555) 987-6543",
      addresses: [
        {
          type: "shipping",
          firstName: "John",
          lastName: "Doe",
          address: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zip: "90001",
          country: "USA",
          isDefault: true,
        },
      ],
    });

    await testUser.save();
    console.log("✓ Test user created successfully");
    console.log("  Email: john@example.com");
    console.log("  Password: TestPassword123");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedDatabase();
