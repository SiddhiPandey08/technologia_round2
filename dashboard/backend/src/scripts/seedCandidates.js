// src/scripts/seedCandidates.js
import "dotenv/config";
import mongoose from "mongoose";
import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import Candidate from "../models/Candidate.js"; // adjust path, note the .js extension

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { maxPoolSize: 20 });
    console.log("Connected to MongoDB");

    const filePath = path.join(__dirname, "../../src/data/candidates.xlsx");
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    if (!rows.length) {
      console.log("No rows found in the sheet.");
      return;
    }

    const candidates = rows.map((row) => ({
      candidateId: String(row.id),
      name: row.name,
      email: row.email,
      branch: row.branch,
      score: row.score,
    }));

    await Candidate.deleteMany({});
    const result = await Candidate.insertMany(candidates, { ordered: false });
    console.log(`Inserted ${result.length} candidates.`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
