//node src/scripts/seedCandidates.js
import "dotenv/config";
import mongoose from "mongoose";
import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import Candidate from "../models/Candidate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 20 });
    console.log("Connected to MongoDB");

    const filePath = path.join(__dirname, "../data/candidates.xlsx");
    const workbook = XLSX.readFile(filePath);

    // Grab the first sheet regardless of its weird name
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      console.log("No rows found in the sheet.");
      return;
    }

    const candidates = rows.map((row) => ({
      candidateId: String(row.id),
      name: String(row.name),
      email: String(row.email),
      branch: String(row.branch),
      score: Number(row.score),
    }));

    // Clear existing collection
    await Candidate.deleteMany({});

    // Insert new candidates
    const result = await Candidate.insertMany(candidates);
    console.log(`Successfully inserted ${result.length} candidates!`);
  } catch (err) {
    console.error("Seeding failed with error:");
    console.error(err); // Print full error stack to see exact validation failure
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
