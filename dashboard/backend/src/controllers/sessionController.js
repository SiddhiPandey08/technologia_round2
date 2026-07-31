import Attempt from "../models/Attempt.js";

const DURATION_MS =
  (Number(process.env.MISSION_DURATION_MINUTES) || 60) * 60 * 1000;

const DEFAULT_MISSIONS = [
  { number: 1, title: "Understand the Project", status: "locked" },
  { number: 2, title: "Build the Foundation", status: "locked" },
  { number: 3, title: "Expand the System", status: "locked" },
  { number: 4, title: "Final Integration", status: "locked" },
];

function serializeAttempt(attempt) {
  return {
    status: attempt.status,
    startedAt: attempt.startedAt,
    endsAt: attempt.endsAt,
    tabSwitches: attempt.tabSwitches || 0,
    missions: attempt.missions,
    serverTime: new Date(),
  };
}

export async function recordTabSwitch(req, res) {
  try {
    const attempt = req.attempt;

    // Don't modify if already ended
    if (attempt.status !== "in-progress") {
      return res.status(409).json({
        error: "Attempt is no longer active",
        status: attempt.status,
        tabSwitches: attempt.tabSwitches,
      });
    }

    const { reason = "tab_switch" } = req.body;

    // Using model instance method to log reason and increment
    const result = await attempt.recordTabSwitch(reason);

    return res.json({
      tabSwitches: result.tabSwitches,
      status: result.status,
      serverTime: new Date(),
    });
  } catch (err) {
    console.error("recordTabSwitch error:", err);
    return res.status(500).json({ error: "Failed to record tab switch." });
  }
}

export async function startSession(req, res) {
  try {
    let attempt = await Attempt.findOne({
      candidate: req.candidateId,
    });

    if (
      attempt &&
      ["in-progress", "submitted", "expired", "terminated"].includes(
        attempt.status,
      )
    ) {
      return res.status(409).json({
        error: "This attempt has already started or ended.",
        status: attempt.status,
      });
    }

    const now = new Date();
    const endsAt = new Date(now.getTime() + DURATION_MS);

    if (!attempt) {
      attempt = new Attempt({
        candidate: req.candidateId,
        status: "not-started",
        missions: DEFAULT_MISSIONS,
      });
    } else if (!attempt.missions || attempt.missions.length === 0) {
      attempt.missions = DEFAULT_MISSIONS;
    }

    attempt.status = "in-progress";
    attempt.startedAt = now;
    attempt.endsAt = endsAt;
    attempt.submittedAt = undefined;
    attempt.tabSwitches = 0; // Reset count on new session start

    attempt.missions.forEach((mission, index) => {
      mission.status = index === 0 ? "active" : "locked";
      mission.unlockedAt = index === 0 ? now : undefined;
      mission.completedAt = undefined;
    });

    await attempt.save();

    return res.status(201).json({
      message: "Session started successfully.",
      ...serializeAttempt(attempt),
    });
  } catch (err) {
    console.error("startSession error:", err);
    return res.status(500).json({
      error: "Failed to start session.",
    });
  }
}

export async function getSession(req, res) {
  res.json(serializeAttempt(req.attempt));
}
