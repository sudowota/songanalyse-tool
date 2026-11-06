import { Request, Response } from "express";
import { ProfileModel } from "../models/Profile";

// AAA: Holt das Badge-Bild. Öffentlich lesbar.
export async function getProfile(_req: Request, res: Response): Promise<void> {
  try {
    const profil = await ProfileModel.findOne({ key: "main" });

    // Schritt 1: Noch kein Bild gespeichert
    if (!profil) {
      res.status(200).json({ bildDataUrl: "" });
      return;
    }

    res.status(200).json({ bildDataUrl: profil.bildDataUrl });
  } catch (error) {
    console.error("Fehler beim Laden des Profils:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}

// AAA: Speichert das Badge-Bild. Nur mit gültigem Admin-Schlüssel.
export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const erwarteterSchluessel = process.env.ADMIN_KEY;

    // Schritt 1: Ist ein Admin-Schlüssel auf dem Server gesetzt?
    if (!erwarteterSchluessel) {
      res.status(500).json({ message: "ADMIN_KEY ist auf dem Server nicht gesetzt." });
      return;
    }

    // Schritt 2: Stimmt der mitgeschickte Schlüssel?
    if (req.header("x-admin-key") !== erwarteterSchluessel) {
      res.status(401).json({ message: "Admin-Schlüssel falsch." });
      return;
    }

    const { bildDataUrl } = req.body;

    // Schritt 3: Nur PNG oder JPEG als Data-URL, Größe begrenzen
    const istBild =
      typeof bildDataUrl === "string" &&
      (bildDataUrl.startsWith("data:image/png;base64,") ||
        bildDataUrl.startsWith("data:image/jpeg;base64,"));

    if (!istBild) {
      res.status(400).json({ message: "Ungültiges Bild." });
      return;
    }

    if (bildDataUrl.length > 500000) {
      res.status(400).json({ message: "Bild ist zu groß." });
      return;
    }

    await ProfileModel.findOneAndUpdate(
      { key: "main" },
      { bildDataUrl },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Profil gespeichert." });
  } catch (error) {
    console.error("Fehler beim Speichern des Profils:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}
