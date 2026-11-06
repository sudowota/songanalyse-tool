// AAA: Anmeldung. Das Token liegt im Browser, die Rechte prüft der Server.
export const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5001/api/songs"
).replace(/\/api\/songs$/, "/api");

const TOKEN_KEY = "style-token";

export type Rolle = "admin" | "teacher" | "student";
export type Nutzer = { id: string; username: string; name: string; role: Rolle };

export function getToken(): string {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Speicher nicht verfügbar: nichts zu löschen
  }
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function login(username: string, password: string): Promise<Nutzer> {
  const response = await fetch(`${API_ROOT}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const daten = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(daten.message ?? "Anmelden fehlgeschlagen.");
  }

  try {
    localStorage.setItem(TOKEN_KEY, daten.token);
  } catch {
    // Ohne Speicher gilt die Anmeldung nur für diesen Tab
  }

  return daten.user;
}

// AAA: Fragt den Server, wer gerade angemeldet ist. Null heißt: niemand.
export async function fetchMe(): Promise<Nutzer | null> {
  if (!getToken()) return null;

  const response = await fetch(`${API_ROOT}/auth/me`, { headers: authHeaders() });

  if (!response.ok) {
    clearToken();
    return null;
  }

  return response.json();
}
