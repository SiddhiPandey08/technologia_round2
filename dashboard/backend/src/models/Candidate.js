import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    candidateId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Candidate", candidateSchema);
