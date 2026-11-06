import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";
import { seedAdmin } from "./utils/seedAdmin";

const port = process.env.PORT || 5000;

async function startServer(): Promise<void> {
  try {
    await connectDB();
    await seedAdmin();

    app.listen(port, () => {
      console.log(`Server läuft auf Port ${port}`);
    });
  } catch (error) {
    console.error("Fehler beim Starten:", error);
    process.exit(1);
  }
}

startServer();
