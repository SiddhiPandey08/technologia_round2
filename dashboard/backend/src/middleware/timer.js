import Attempt from "../models/Attempt.js";
import Candidate from "../models/Candidate.js";

export async function loadAttempt(req, res, next) {
  let attempt = null;
  if (req.candidateId) {
    attempt = await Attempt.findOne({ candidate: req.candidateId });
  }

  if (!attempt && req.candidateCode) {
    const candidate = await Candidate.findOne({
      candidateId: req.candidateCode,
    }).lean();
    if (candidate) {
      attempt = await Attempt.findOne({ candidate: candidate._id });
    }
  }

  if (!attempt) {
    return res
      .status(404)
      .json({ error: "No attempt found for this candidate." });
  }

  if (
    attempt.status === "in-progress" &&
    attempt.endsAt &&
    Date.now() > attempt.endsAt.getTime()
  ) {
    attempt.status = "expired";
    await attempt.save();
  }

  req.attempt = attempt;
  next();
}

export function blockIfExpired(req, res, next) {
  const isTerminated =
    req.attempt.status === "terminated" || req.attempt.tabSwitches >= 3;

  if (req.attempt.status !== "in-progress" || isTerminated) {
    return res.status(403).json({
      error:
        "This attempt has been terminated or expired due to policy enforcement.",
      status: req.attempt.status,
      tabSwitches: req.attempt.tabSwitches,
    });
  }
  next();
}
