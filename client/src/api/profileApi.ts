import { API_ROOT, authHeaders } from "./authApi";

// AAA: Badge-Bild laden (öffentlich) und speichern (nur Lehrer und Admins).
const PROFILE_URL = `${API_ROOT}/profile`;

export async function getProfile(): Promise<string> {
  const response = await fetch(PROFILE_URL);

  if (!response.ok) {
    throw new Error("Profil konnte nicht geladen werden.");
  }

  const daten = await response.json();
  return daten.bildDataUrl ?? "";
}

export async function saveProfile(bildDataUrl: string): Promise<void> {
  const response = await fetch(PROFILE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ bildDataUrl }),
  });

  if (!response.ok) {
    const daten = await response.json().catch(() => ({}));
    throw new Error(daten.message ?? "Speichern fehlgeschlagen.");
  }
}
