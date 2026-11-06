import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Rolle } from "../api/authApi";

type RequireAuthProps = {
  rollen?: Rolle[];
  children: ReactNode;
};

// AAA: Schützt eine Seite. Ohne Anmeldung geht es zur Anmeldung,
// ohne passende Rolle zurück zur Startseite.
export default function RequireAuth({ rollen, children }: RequireAuthProps) {
  const { nutzer, laedt } = useAuth();

  // Schritt 1: Während der Prüfung nichts zeigen
  if (laedt) {
    return <p>lade...</p>;
  }

  // Schritt 2: Nicht angemeldet
  if (!nutzer) {
    return <Navigate to="/login" replace />;
  }

  // Schritt 3: Rolle passt nicht
  if (rollen && !rollen.includes(nutzer.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
