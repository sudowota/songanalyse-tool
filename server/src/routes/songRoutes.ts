import { Router } from "express";
import {
  createSong,
  deleteSong,
  getSongById,
  getSongs,
  updateSong,
} from "../controllers/songController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

// Lesen: alle angemeldeten Rollen. Schreiben: nur Lehrer und Admins.
router.get("/", requireAuth, getSongs);
router.get("/:id", requireAuth, getSongById);
router.post("/", requireAuth, requireRole("admin", "teacher"), createSong);
router.put("/:id", requireAuth, requireRole("admin", "teacher"), updateSong);
router.delete("/:id", requireAuth, requireRole("admin", "teacher"), deleteSong);

export default router;
