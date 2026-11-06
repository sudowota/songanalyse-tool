import type { Song } from "../types/song";
import { authHeaders } from "./authApi";

// AAA: Adresse der Song-Schnittstelle. Im Deploy über VITE_API_BASE_URL gesetzt.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:5001/api/songs";

export type CreateSongData = {
  title: string;
  artist: string;
  tempo?: number;
  progression: string;
  groove: string;
  instruments: string[];
  feeling: string;
  magicMoment: string;
  lyrics: string;
  associations: string[];
};

export type SongFilters = {
  progression?: string;
  feeling?: string;
  groove?: string;
  tempo?: string;
  tempoMin?: string;
  tempoMax?: string;
  instrument?: string;
  association?: string;
};

// AAA: Wirft einen Fehler mit der Meldung des Servers, falls vorhanden.
async function pruefeAntwort(response: Response, standard: string): Promise<void> {
  if (response.ok) return;
  const daten = await response.json().catch(() => ({}));
  throw new Error(daten.message ?? standard);
}

export async function getSongs(filters: SongFilters = {}): Promise<Song[]> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== "") {
      params.append(key, value.trim());
    }
  });

  const url = params.toString()
    ? `${API_BASE_URL}?${params.toString()}`
    : API_BASE_URL;

  const response = await fetch(url, { headers: authHeaders() });
  await pruefeAntwort(response, "Fehler beim Laden der Songs.");
  return response.json();
}

export async function createSong(data: CreateSongData): Promise<Song> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  await pruefeAntwort(response, "Fehler beim Erstellen des Songs.");
  return response.json();
}

export async function getSongById(id: string): Promise<Song> {
  const response = await fetch(`${API_BASE_URL}/${id}`, { headers: authHeaders() });
  await pruefeAntwort(response, "Song konnte nicht geladen werden.");
  return response.json();
}

export async function deleteSong(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await pruefeAntwort(response, "Song konnte nicht gelöscht werden.");
}

export async function updateSong(id: string, data: CreateSongData): Promise<Song> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  await pruefeAntwort(response, "Song konnte nicht aktualisiert werden.");
  return response.json();
}
