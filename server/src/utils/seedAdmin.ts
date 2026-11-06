import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";

// AAA: Legt beim ersten Start einen Admin an, aus ADMIN_USERNAME und ADMIN_PASSWORD.
export async function seedAdmin(): Promise<void> {
  const username = process.env.ADMIN_USERNAME;
  const passwort = process.env.ADMIN_PASSWORD;

  // Schritt 1: Zugangsdaten vorhanden?
  if (!username || !passwort) {
    console.warn("ADMIN_USERNAME oder ADMIN_PASSWORD fehlt, kein Admin angelegt.");
    return;
  }

  // Schritt 2: Gibt es das Konto schon?
  const vorhanden = await UserModel.findOne({ username: username.trim().toLowerCase() });
  if (vorhanden) {
    return;
  }

  // Schritt 3: Konto mit gehashtem Passwort anlegen
  const passwordHash = await bcrypt.hash(passwort, 10);
  await UserModel.create({ username, name: username, passwordHash, role: "admin" });
  console.log("Admin-Konto angelegt.");
}
