// AAA: Badge-Bild laden und speichern.
const PROFILE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5001/api/songs")
  .replace(/\/api\/songs$/, "/api/profile");

export async function getProfile(): Promise<string> {
  const response = await fetch(PROFILE_URL);

  if (!response.ok) {
    throw new Error("Profil konnte nicht geladen werden.");
  }

  const daten = await response.json();
  return daten.bildDataUrl ?? "";
}

export async function saveProfile(bildDataUrl: string, adminKey: string): Promise<void> {
  const response = await fetch(PROFILE_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    },
    body: JSON.stringify({ bildDataUrl }),
  });

  if (!response.ok) {
    const daten = await response.json().catch(() => ({}));
    throw new Error(daten.message ?? "Speichern fehlgeschlagen.");
  }
}
