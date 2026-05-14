import express from "express";
import cors from "cors";
import songRoutes from "./routes/songRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({ message: "Server läuft." });
});

app.use("/api/songs", songRoutes);

export default app;