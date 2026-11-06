import express from "express";
import cors from "cors";
import songRoutes from "./routes/songRoutes";
import profileRoutes from "./routes/profileRoutes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Server läuft." });
});

app.use("/api/songs", songRoutes);
app.use("/api/profile", profileRoutes);

export default app;