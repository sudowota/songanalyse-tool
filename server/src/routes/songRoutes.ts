import { Router } from "express";
import {
  createSong,
  deleteSong,
  getSongById,
  getSongs,
  updateSong,
} from "../controllers/songController";

const router = Router();

router.get("/", getSongs);
router.get("/:id", getSongById);
router.post("/", createSong);
router.delete("/:id", deleteSong);
router.put("/:id", updateSong);

router.get("/", getSongs);
router.get("/:id", getSongById);
router.post("/", createSong);
router.put("/:id", updateSong);
router.delete("/:id", deleteSong);

export default router;

