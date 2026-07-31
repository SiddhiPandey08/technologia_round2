import Architecture from "../models/Architecture.js";
import { getMissionDefinition } from "../data/missions.js";
import Attempt from "../models/Attempt.js";

export async function listMissions(req, res) {
  const merged = req.attempt.missions.map((state) => {
    const def = getMissionDefinition(state.number);
    const base = {
      number: state.number,
      title: def.title,
      status: state.status,
    };
    return state.status === "locked"
      ? base
      : { ...base, scenario: def.scenario, objectives: def.objectives };
  });
  res.json({
    missions: merged,
    attemptStatus: req.attempt.status,
    endsAt: req.attempt.endsAt,
  });
}

export async function getMission(req, res) {
  const number = Number(req.params.number);
  const state = req.attempt.missions.find((m) => m.number === number);
  const def = getMissionDefinition(number);

  if (!state || !def)
    return res.status(404).json({ error: "Mission not found." });
  if (state.status === "locked")
    return res.status(403).json({ error: "This mission is still locked." });

  res.json({ ...def, status: state.status });
}

// Fetch a previously saved architecture for any unlocked mission — used by
// Mission 4 to pull in the Mission 3 ('v3') architecture for review before
// the candidate submits the final version.
export async function getArchitecture(req, res) {
  const number = Number(req.params.number);
  const state = req.attempt.missions.find((m) => m.number === number);
  const def = getMissionDefinition(number);

  if (!state || !def)
    return res.status(404).json({ error: "Mission not found." });
  if (state.status === "locked")
    return res.status(403).json({ error: "This mission is still locked." });

  const architecture = await Architecture.findOne({
    candidate: req.candidateId,
    missionNumber: number,
    versionLabel: def.savesVersion,
  });

  res.json({ architecture: architecture || null });
}

// Autosave and explicit save both land here — isAutosave just controls
// whether the client shows a "saved" toast or a silent write.
//
// deploymentPlan is optional and only meaningful for Mission 4 — missions
// 1–3 simply won't send it, and it'll be stored as empty strings.
export async function saveArchitecture(req, res) {
  const number = Number(req.params.number);
  const state = req.attempt.missions.find((m) => m.number === number);
  const def = getMissionDefinition(number);

  if (!state || !def)
    return res.status(404).json({ error: "Mission not found." });
  if (state.status === "locked")
    return res.status(403).json({ error: "This mission is still locked." });

  const {
    components = [],
    connections = [],
    deploymentPlan,
    answers,
    isAutosave = false,
  } = req.body;

  // Extract deployment details safely
  const safeDeploymentPlan = {
    rollout:
      deploymentPlan?.rollout ||
      deploymentPlan?.rolloutPlan ||
      answers?.deploymentPlan?.rolloutPlan ||
      "",
    rollback:
      deploymentPlan?.rollback ||
      deploymentPlan?.rollbackPlan ||
      answers?.deploymentPlan?.rollbackPlan ||
      "",
    monitoring: deploymentPlan?.monitoring || "",
  };

  // ✅ UPSERT: Create if doesn't exist, update if it does
  const versionLabel = def.savesVersion || `v${number}`;
  const architecture = await Architecture.findOneAndUpdate(
    {
      candidate: req.candidateId,
      missionNumber: number,
      versionLabel: versionLabel,
    },
    {
      payload: {
        components,
        connections,
        deploymentPlan: safeDeploymentPlan,
        answers: answers || {},
      },
      updatedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  // Keep answers synced directly on the attempt mission object
  if (
    answers ||
    Object.keys(safeDeploymentPlan).some((k) => safeDeploymentPlan[k])
  ) {
    state.answers = {
      ...(state.answers || {}),
      ...(answers || {}),
      deploymentPlan: safeDeploymentPlan,
    };
    req.attempt.markModified("missions");
    await req.attempt.save();
  }

  // ✅ Safe to access properties now!
  res.json({
    savedAt: architecture.updatedAt,
    versionLabel: architecture.versionLabel,
  });
}
export async function completeMission(req, res) {
  const number = Number(req.params.number);
  const attempt = req.attempt;
  const state = attempt.missions.find((m) => m.number === number);

  if (!state) return res.status(404).json({ error: "Mission not found." });

  if (state.status === "complete") {
    // Already completed — return current state instead of erroring.
    return res.json({
      missions: attempt.missions,
      attemptStatus: attempt.status,
    });
  }

  if (state.status !== "active")
    return res
      .status(409)
      .json({ error: "This mission is not currently active." });

  state.status = "complete";
  state.completedAt = new Date();

  const next = attempt.missions.find((m) => m.number === number + 1);
  if (next) {
    next.status = "active";
    next.unlockedAt = new Date();
  } else {
    attempt.status = "submitted";
    attempt.submittedAt = new Date();
  }

  await attempt.save();
  res.json({ missions: attempt.missions, attemptStatus: attempt.status });
}

// DEV ONLY — sets every mission to 'active' for the signed-in candidate so
// you can jump straight to any mission while others are still being built.
// Guarded by NODE_ENV so it can never run against real candidate data in
// production. Delete this (and its route) once all four missions are ready
// and real testing should go through the normal unlock sequence.
export async function devUnlockAllMissions(req, res) {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "Not found." });
  }

  const attempt = req.attempt;
  attempt.missions.forEach((m) => {
    m.status = "active";
    m.unlockedAt = m.unlockedAt || new Date();
  });
  if (attempt.status === "not-started") {
    attempt.status = "in-progress";
    attempt.startedAt = attempt.startedAt || new Date();
    attempt.endsAt = attempt.endsAt || new Date(Date.now() + 60 * 60 * 1000);
  }

  await attempt.save();
  res.json({ missions: attempt.missions, attemptStatus: attempt.status });
}

// DEV ONLY — full reset for repeat testing: revives a 'submitted' or
// 'expired' attempt back to 'in-progress', pushes endsAt an hour out, and
// reopens every mission as 'active'. Same production guard as unlock-all.
// Does NOT delete any saved Architecture docs — those stay, so re-entering
// a mission will still show whatever was last saved for it.
export async function devResetAttempt(req, res) {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ error: "Not found." });
  }

  const attempt = req.attempt;
  attempt.status = "in-progress";
  attempt.startedAt = attempt.startedAt || new Date();
  attempt.endsAt = new Date(Date.now() + 60 * 60 * 1000);
  attempt.submittedAt = undefined;
  attempt.missions.forEach((m) => {
    m.status = "active";
  });

  await attempt.save();
  res.json({
    missions: attempt.missions,
    attemptStatus: attempt.status,
    endsAt: attempt.endsAt,
  });
}

export async function startAttempt(req, res) {
  let attempt = await Attempt.findOne({
    candidate: req.candidateId,
  });
  if (attempt && attempt.status !== "not-started") {
    // Already started — just return current state instead of erroring.
    return res.json({
      message: "Attempt already in progress.",
      attemptStatus: attempt.status,
      missions: attempt.missions,
      endsAt: attempt.endsAt,
    });
  }
  if (!attempt) {
    attempt = new Attempt({
      candidate: req.candidateId,
    });
  }

  if (attempt.status !== "not-started") {
    return res.status(400).json({
      error: "Attempt has already been started.",
    });
  }

  const now = new Date();

  attempt.status = "in-progress";
  attempt.startedAt = now;
  attempt.endsAt = new Date(now.getTime() + 60 * 60 * 1000);

  attempt.missions[0].status = "active";
  attempt.missions[0].unlockedAt = now;

  await attempt.save();

  res.json({
    message: "Attempt started.",
    attemptStatus: attempt.status,
    missions: attempt.missions,
    endsAt: attempt.endsAt,
  });
}
// Saves generic case study / workspace answers (e.g. Mission 2 OOP or Mission 3 Web Dev)
export async function saveAnswers(req, res) {
  const number = Number(req.params.number);
  const attempt = req.attempt;
  const state = attempt.missions.find((m) => m.number === number);
  const def = getMissionDefinition(number);

  if (!state || !def)
    return res.status(404).json({ error: "Mission not found." });
  if (state.status === "locked")
    return res.status(403).json({ error: "This mission is still locked." });

  const { answers } = req.body;

  // 1. SAVE TO ATTEMPT MODEL (Inside the missions array)
  state.answers = answers || {};
  // Mark modified so Mongoose updates subdocument in array
  attempt.markModified("missions");
  await attempt.save();

  // 2. PERSIST TO ARCHITECTURE MODEL AS BACKUP/VERSION
  const record = await Architecture.findOneAndUpdate(
    {
      candidate: req.candidateId,
      missionNumber: number,
      versionLabel: def.savesVersion || `v${number}`,
    },
    {
      payload: {
        answers: answers || {},
      },
    },
    { upsert: true, new: true },
  );

  res.json({
    savedAt: record.updatedAt,
    versionLabel: record.versionLabel,
    answers: state.answers,
  });
}
