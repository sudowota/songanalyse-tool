import { Router } from "express";
import { createUser, listUsers, resetPassword } from "../controllers/userController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Alle Nutzer-Routen nur für Admins
router.use(requireAuth, requireRole("admin"));

router.get("/", listUsers);
router.post("/", createUser);
router.put("/:id/password", resetPassword);

export default router;
