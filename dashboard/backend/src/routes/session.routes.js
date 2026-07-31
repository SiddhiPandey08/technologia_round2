import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { loadAttempt } from "../middleware/timer.js";
import {
  startSession,
  getSession,
  recordTabSwitch,
} from "../controllers/sessionController.js";

const router = Router();
router.post("/start", requireAuth, startSession);
router.get("/", requireAuth, loadAttempt, getSession);
router.post("/tab-switch", requireAuth, loadAttempt, recordTabSwitch);

export default router;
