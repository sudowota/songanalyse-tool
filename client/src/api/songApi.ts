import type { Song } from "../types/song";

const API_BASE_URL = "http://127.0.0.1:5001/api/songs";

export type CreateSongData = {
  title: string;
  artist: string;
  tempo?: number;
  progression: string;
  groove: string;
  instruments: string[];
  feeling: string;
  magicMoment: string;
  associations: string[];
};

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

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Songs.");
  }

  return response.json();
}

export async function createSong(data: CreateSongData): Promise<Song> {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Fehler beim Erstellen des Songs.");
  }

  return response.json();
}

export async function getSongById(id: string): Promise<Song> {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error("Song konnte nicht geladen werden.");
  }

  return response.json();
}

export async function deleteSong(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Song konnte nicht gelöscht werden.");
  }
}

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

export async function updateSong(
  id: string,
  data: CreateSongData
): Promise<Song> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Song konnte nicht aktualisiert werden.");
  }

  return response.json();
}