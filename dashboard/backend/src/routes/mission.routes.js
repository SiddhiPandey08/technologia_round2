import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { loadAttempt, blockIfExpired } from "../middleware/timer.js";
import {
  listMissions,
  getMission,
  getArchitecture,
  saveArchitecture,
  saveAnswers, // <-- ADDED
  completeMission,
  devUnlockAllMissions,
  devResetAttempt,
  startAttempt,
} from "../controllers/missionController.js";

const router = Router();

router.get("/", requireAuth, loadAttempt, listMissions);
router.get("/:number", requireAuth, loadAttempt, getMission);
router.get("/:number/architecture", requireAuth, loadAttempt, getArchitecture);

router.post(
  "/:number/architecture",
  requireAuth,
  loadAttempt,
  blockIfExpired,
  saveArchitecture,
);

// <-- ADDED: Dedicated endpoint for workspace case studies (Missions 2 & 3)
router.post(
  "/:number/answers",
  requireAuth,
  loadAttempt,
  blockIfExpired,
  saveAnswers,
);

router.post(
  "/:number/complete",
  requireAuth,
  loadAttempt,
  blockIfExpired,
  completeMission,
);

// DEV ONLY — see production guards in the controller.
router.post("/dev/unlock-all", requireAuth, loadAttempt, devUnlockAllMissions);
router.post("/dev/reset", requireAuth, loadAttempt, devResetAttempt);
router.post("/start", requireAuth, startAttempt);

export default router;
