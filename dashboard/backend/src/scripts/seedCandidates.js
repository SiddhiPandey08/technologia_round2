// Run with: node src/scripts/seedCandidates.js
// Edit the CANDIDATES list below, or adapt this to read from a CSV export
// of your Round 1 shortlist.

import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import Candidate from "../models/Candidate.js";
import mongoose from "mongoose";

const CANDIDATES = [
  {
    candidateId: "TN-001",
    name: "Example Candidate1",
    email: "example1@college.edu",
    password: "changeme123",
  },
];

async function seed() {
  await connectDB();

  for (const c of CANDIDATES) {
    const passwordHash = await bcrypt.hash(c.password, 10);
    await Candidate.findOneAndUpdate(
      { candidateId: c.candidateId },
      {
        candidateId: c.candidateId,
        name: c.name,
        email: c.email,
        passwordHash,
      },
      { upsert: true },
    );
    console.log(`seeded ${c.candidateId} — ${c.name}`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
