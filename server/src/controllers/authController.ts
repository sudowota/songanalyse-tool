import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User";
import { AuthRequest } from "../middleware/auth";

// AAA: Anmelden. Prüft Benutzername und Passwort und gibt ein Token zurück.
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const geheim = process.env.JWT_SECRET;
    if (!geheim) {
      res.status(500).json({ message: "JWT_SECRET fehlt auf dem Server." });
      return;
    }

    const { username, password } = req.body;
    if (typeof username !== "string" || typeof password !== "string") {
      res.status(400).json({ message: "Benutzername und Passwort angeben." });
      return;
    }

    const nutzer = await UserModel.findOne({ username: username.trim().toLowerCase() });
    const passt = nutzer ? await bcrypt.compare(password, nutzer.passwordHash) : false;

    if (!nutzer || !passt) {
      res.status(401).json({ message: "Benutzername oder Passwort falsch." });
      return;
    }

    const token = jwt.sign(
      { sub: nutzer.id, username: nutzer.username, role: nutzer.role },
      geheim,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: { id: nutzer.id, username: nutzer.username, name: nutzer.name, role: nutzer.role },
    });
  } catch (error) {
    console.error("Fehler beim Anmelden:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}

// AAA: Gibt den angemeldeten Nutzer zurück, damit das Frontend die Rolle kennt.
export async function me(req: Request, res: Response): Promise<void> {
  try {
    const angemeldet = (req as AuthRequest).user;
    const nutzer = angemeldet ? await UserModel.findById(angemeldet.id) : null;

    if (!nutzer) {
      res.status(401).json({ message: "Bitte anmelden." });
      return;
    }

    res.status(200).json({
      id: nutzer.id,
      username: nutzer.username,
      name: nutzer.name,
      role: nutzer.role,
    });
  } catch (error) {
    console.error("Fehler bei /me:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}
