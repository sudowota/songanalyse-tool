import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profileController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/", getProfile);
router.put("/", requireAuth, requireRole("admin", "teacher"), updateProfile);

export default router;
