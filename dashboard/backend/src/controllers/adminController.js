import Candidate from "../models/Candidate.js";
import Attempt from "../models/Attempt.js";
import Architecture from "../models/Architecture.js";

// GET /api/admin/candidates — one row per candidate with a quick progress summary.
export async function listCandidates(req, res) {
  const candidates = await Candidate.find().sort({ createdAt: 1 }).lean();
  const attempts = await Attempt.find().lean();
  const attemptByCandidate = new Map(
    attempts.map((a) => [String(a.candidate), a]),
  );

  const rows = candidates.map((c) => {
    const attempt = attemptByCandidate.get(String(c._id));
    return {
      _id: c._id,
      candidateId: c.candidateId,
      name: c.name,
      email: c.email,
      attemptStatus: attempt?.status || "not-started",
      startedAt: attempt?.startedAt || null,
      submittedAt: attempt?.submittedAt || null,
      missions: attempt?.missions || [],
    };
  });

  res.json({ candidates: rows });
}

export async function getCandidateDetail(req, res) {
  try {
    const { id } = req.params; // Expecting the MongoDB _id string from frontend

    // 1. Find candidate by _id (or fallback to human candidateId)
    const candidate = await Candidate.findOne({
      $or: [{ _id: id }, { candidateId: id }],
    });

    if (!candidate) {
      return res.status(404).json({ error: "Candidate not found." });
    }

    // 2. Fetch associated attempt using candidate._id
    const attempt = await Attempt.findOne({ candidate: candidate._id });

    // 3. Fetch associated architectures using candidate._id
    const architectures = await Architecture.find({ candidate: candidate._id });

    return res.json({
      candidate: {
        _id: candidate._id,
        candidateId: candidate.candidateId,
        name: candidate.name,
        email: candidate.email,
        attempt,
        architectures,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
