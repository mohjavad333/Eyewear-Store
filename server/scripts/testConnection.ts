import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../db";

dotenv.config();

async function testConnection() {
  console.log("🧪 Testing MongoDB Connection...\n");

  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      "mongodb://localhost:27017/optics_store";
    console.log(`📍 Connection URI: ${mongoUri.replace(/:[^:]*@/, ":***@")}`);
    console.log("⏳ Connecting to MongoDB...\n");

    const connected = await connectDB();

    if (connected) {
      console.log("✅ Successfully connected to MongoDB!\n");

      // Get database info
      const admin = mongoose.connection.db!.admin();
      const dbStats = await admin.listDatabases();
      console.log(`📊 Available databases: ${dbStats.databases.length}`);
      console.log(
        `   Current DB: ${mongoose.connection.name} (${
          dbStats.databases.find((db) => db.name === mongoose.connection.name)
            ?.sizeOnDisk || "unknown"
        } bytes)`
      );

      // Check collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`\n📋 Collections in "${mongoose.connection.name}":`);
      if (collections.length === 0) {
        console.log("   (empty - run 'npm run seed' to create demo users)");
      } else {
        collections.forEach((col) => console.log(`   - ${col.name}`));
      }

      // Check users collection
      try {
        const User = mongoose.model("User");
        const userCount = await User.countDocuments();
        console.log(`\n👥 Users in database: ${userCount}`);

        if (userCount > 0) {
          const users = await User.find().select("firstName lastName email");
          console.log("   Registered users:");
          users.forEach((user: any) => {
            console.log(`   - ${user.firstName} ${user.lastName} (${user.email})`);
          });
        } else {
          console.log(
            "\n⚠️  No users found. Run 'npm run seed' to create demo accounts."
          );
        }
      } catch (error: any) {
        if (error.name === "MissingSchemaError") {
          console.log(
            "\n   (User collection exists but schema not loaded in this session)"
          );
        } else {
          throw error;
        }
      }

      console.log("\n✨ Connection test successful!");
      console.log("\n📝 Next steps:");
      console.log("   1. Run: npm run seed (to create demo users)");
      console.log("   2. Run: pnpm run dev (to start the dev server)");
      console.log("   3. Visit: http://localhost:8080/login");
      console.log("   4. Use: demo@example.com / password123");
      await mongoose.disconnect();
    } else {
      console.log("❌ Failed to connect to MongoDB");
      console.log(
        "\n💡 Please ensure MongoDB is running. Try one of these:\n"
      );
      console.log(
        "   Local MongoDB: mongod (or use brew services start mongodb-community)"
      );
      console.log(
        "   MongoDB Atlas: Check your connection string and whitelist your IP"
      );
      console.log(
        "   See MONGODB_SETUP.md for detailed instructions\n"
      );
      await mongoose.disconnect();
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Connection test failed:");
    console.error(
      error instanceof Error ? error.message : String(error)
    );
    console.log(
      "\n💡 Troubleshooting tips:\n"
    );
    console.log("   1. Check MongoDB is running (mongod)");
    console.log("   2. Check .env file has correct MONGODB_URI");
    console.log("   3. Check MongoDB Atlas whitelist includes your IP");
    console.log("   4. Check username/password in connection string\n");
    await mongoose.disconnect();
    process.exit(1);
  }
}

testConnection();
