import type { Song } from "../types/song";

const API_BASE_URL = "http://127.0.0.1:5001/api/songs";

export async function getSongs(): Promise<Song[]> {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    throw new Error("Fehler beim Laden der Songs.");
  }

  return response.json();
}

export async function createSong(data: {
  title: string;
  artist: string;
}): Promise<Song> {
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