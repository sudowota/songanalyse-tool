import express from "express";
import cors from "cors";
import songRoutes from "./routes/songRoutes";
import profileRoutes from "./routes/profileRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Server läuft." });
});

app.use("/api/songs", songRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;