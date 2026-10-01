import mongoose from "mongoose";

function getMongoDbUri(): string {
  return (
    process.env.MONGODB_URI ||
    process.env.DATABASE_URL ||
    "mongodb://localhost:27017/optics_store"
  );
}

export async function connectDB() {
  try {
    await mongoose.connect(getMongoDbUri());
    console.log("✓ Connected to MongoDB");
    return true;
  } catch (error) {
    console.warn("⚠ MongoDB connection failed - running in offline mode");
    console.warn(`  ${error instanceof Error ? error.message : String(error)}`);
    console.warn("  Auth endpoints will not work until MongoDB is available");
    return false;
  }
}

export default mongoose;
