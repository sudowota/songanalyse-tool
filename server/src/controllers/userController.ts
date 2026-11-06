import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User";

const erlaubteRollen = ["admin", "teacher", "student"];

// AAA: Alle Konten auflisten (ohne Passwort-Hash).
export async function listUsers(_req: Request, res: Response): Promise<void> {
  try {
    const nutzer = await UserModel.find({}, "username name role createdAt").sort({ createdAt: -1 });
    res.status(200).json(nutzer);
  } catch (error) {
    console.error("Fehler beim Laden der Nutzer:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}

// AAA: Neues Konto anlegen. Nur Admins dürfen das.
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { username, password, name, role } = req.body;

    // Schritt 1: Eingaben prüfen
    if (typeof username !== "string" || username.trim() === "") {
      res.status(400).json({ message: "Benutzername fehlt." });
      return;
    }
    if (typeof password !== "string" || password.length < 8) {
      res.status(400).json({ message: "Passwort muss mindestens 8 Zeichen haben." });
      return;
    }
    if (!erlaubteRollen.includes(role)) {
      res.status(400).json({ message: "Ungültige Rolle." });
      return;
    }

    // Schritt 2: Konto mit gehashtem Passwort speichern
    const passwordHash = await bcrypt.hash(password, 10);
    const neu = await UserModel.create({
      username: username.trim(),
      name: typeof name === "string" ? name.trim() : "",
      passwordHash,
      role,
    });

    res.status(201).json({ id: neu.id, username: neu.username, name: neu.name, role: neu.role });
  } catch (error: any) {
    if (error?.code === 11000) {
      res.status(409).json({ message: "Dieser Benutzername ist schon vergeben." });
      return;
    }
    console.error("Fehler beim Anlegen des Nutzers:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}
