import { API_ROOT, authHeaders, type Rolle } from "./authApi";

// AAA: Nutzerverwaltung, nur für Admins.
const USERS_URL = `${API_ROOT}/users`;

export type NutzerZeile = {
  _id: string;
  username: string;
  name: string;
  role: Rolle;
  createdAt: string;
};

export async function listUsers(): Promise<NutzerZeile[]> {
  const response = await fetch(USERS_URL, { headers: authHeaders() });

  if (!response.ok) {
    const daten = await response.json().catch(() => ({}));
    throw new Error(daten.message ?? "Nutzer konnten nicht geladen werden.");
  }

  return response.json();
}

export async function createUser(data: {
  username: string;
  password: string;
  name: string;
  role: Rolle;
}): Promise<void> {
  const response = await fetch(USERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const daten = await response.json().catch(() => ({}));
    throw new Error(daten.message ?? "Konto konnte nicht angelegt werden.");
  }
}

// AAA: Admin setzt das Passwort eines Kontos neu.
export async function resetUserPassword(id: string, neuesPasswort: string): Promise<string> {
  const response = await fetch(`${USERS_URL}/${id}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ neuesPasswort }),
  });

  const daten = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(daten.message ?? "Passwort konnte nicht gesetzt werden.");
  }

  return daten.message ?? "Passwort wurde neu gesetzt.";
}
