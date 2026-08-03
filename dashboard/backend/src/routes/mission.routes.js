import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { loadAttempt, blockIfExpired } from "../middleware/timer.js";
import {
  listMissions,
  getMission,
  getArchitecture,
  saveArchitecture,
  saveAnswers,
  completeMission,
  devUnlockAllMissions,
  devResetAttempt,
  startAttempt,
} from "../controllers/missionController.js";

const router = Router();

router.get("/", requireAuth, loadAttempt, listMissions);
router.get("/:number", requireAuth, loadAttempt, getMission);
router.get("/:number/architecture", requireAuth, loadAttempt, getArchitecture);

// Saves must be allowed to land even if the timer has just expired —
// blockIfExpired only guards actions that advance/complete the attempt.
router.post(
  "/:number/architecture",
  requireAuth,
  loadAttempt,
  saveArchitecture,
);
router.post("/:number/answers", requireAuth, loadAttempt, saveAnswers);

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
