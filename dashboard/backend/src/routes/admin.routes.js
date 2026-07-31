import { Router } from "express";
import { requireAdmin } from "../middleware/adminAuth.js";
import {
  listCandidates,
  getCandidateDetail,
} from "../controllers/adminController.js";

const router = Router();

router.get("/candidates", requireAdmin, listCandidates);
router.get("/candidates/:id", requireAdmin, getCandidateDetail);

export default router;
