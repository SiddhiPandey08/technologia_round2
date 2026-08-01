import "dotenv/config";
import mongoose from "mongoose";
import Attempt from "./src/models/Attempt.js";

async function resetTime() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const attempts = await Attempt.find({});
    const newEndsAt = new Date(Date.now() + 60 * 60 * 1000); // 60 mins from now

    const result = await Attempt.updateMany(
      {},
      { $set: { endsAt: newEndsAt, status: "in-progress", tabSwitches: 0 } }
    );

    console.log(`Updated ${result.modifiedCount} attempts. New endsAt: ${newEndsAt}`);
    
    // Also reset terminated status if they were terminated
    await Attempt.updateMany(
      { status: "expired" },
      { $set: { status: "in-progress" } }
    );
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetTime();
