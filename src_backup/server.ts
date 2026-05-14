import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { connectDB } from "./config/db";

const port = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(\`Server läuft auf Port \${port}\`);
    });
  } catch (error) {
    console.error("Server Fehler:", error);
    process.exit(1);
  }
}

start();
