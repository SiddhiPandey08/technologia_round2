import bcrypt from "bcryptjs";
import Candidate from "../models/Candidate.js";
import { signToken } from "../utils/jwt.js";

export async function login(req, res) {
  const { candidateId, password } = req.body;
  if (!candidateId) {
    return res.status(400).json({ error: "Candidate ID is required." });
  }

  const candidate = await Candidate.findOne({ candidateId });
  if (!candidate) {
    return res.status(401).json({
      error: "That candidate ID incorrect.",
    });
  }

  const token = signToken(candidate);
  res.json({
    token,
    candidate: {
      id: candidate._id,
      candidateId: candidate.candidateId,
      name: candidate.name,
    },
  });
}
