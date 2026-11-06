import { Router } from "express";
import { createUser, listUsers } from "../controllers/userController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Alle Nutzer-Routen nur für Admins
router.use(requireAuth, requireRole("admin"));

router.get("/", listUsers);
router.post("/", createUser);

export default router;
