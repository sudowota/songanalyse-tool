import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export type Rolle = "admin" | "teacher" | "student";
export type AngemeldeterNutzer = { id: string; username: string; role: Rolle };
export type AuthRequest = Request & { user?: AngemeldeterNutzer };

// AAA: Prüft das Token im Header "Authorization: Bearer ...".
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // Schritt 1: Token aus dem Header holen
  const kopf = req.header("authorization") ?? "";
  const token = kopf.startsWith("Bearer ") ? kopf.slice(7) : "";

  if (!token) {
    res.status(401).json({ message: "Bitte anmelden." });
    return;
  }

  // Schritt 2: Geheimnis muss auf dem Server gesetzt sein
  const geheim = process.env.JWT_SECRET;
  if (!geheim) {
    res.status(500).json({ message: "JWT_SECRET fehlt auf dem Server." });
    return;
  }

  // Schritt 3: Token prüfen und Nutzer merken
  try {
    const daten = jwt.verify(token, geheim) as { sub: string; username: string; role: Rolle };
    (req as AuthRequest).user = { id: daten.sub, username: daten.username, role: daten.role };
    next();
  } catch {
    res.status(401).json({ message: "Sitzung abgelaufen. Bitte neu anmelden." });
  }
}

// AAA: Lässt nur bestimmte Rollen durch.
export function requireRole(...erlaubt: Rolle[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const nutzer = (req as AuthRequest).user;

    if (!nutzer || !erlaubt.includes(nutzer.role)) {
      res.status(403).json({ message: "Keine Berechtigung für diese Aktion." });
      return;
    }

    next();
  };
}
