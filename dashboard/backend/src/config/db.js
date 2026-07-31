import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI is not set");

  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(uri, { dbName: "recruit-os" });
    console.log("connected to mongodb (db: recruit-os)");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err; // let whoever calls connectDB() decide whether to crash the boot
  }
}
