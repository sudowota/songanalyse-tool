import { useEffect, useState } from "react";
import { deleteSong, getSongs, type SongFilters } from "../api/songApi";
import SongList from "../components/SongList";
import SongFilter from "../components/SongFilter";
import type { Song } from "../types/song";

export default function SongListPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [filters, setFilters] = useState<SongFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  async function loadSongs(activeFilters: SongFilters = {}) {
    setIsLoading(true);
    const data = await getSongs(activeFilters);
    setSongs(data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadSongs();
  }, []);

  async function handleSearch() {
    await loadSongs(filters);
  }

  async function handleReset() {
    setFilters({});
    await loadSongs({});
  }

async function handleDeleteSong(id: string) {
  const confirmed = window.confirm("Diesen Song wirklich löschen?");

  if (!confirmed) return;

  await deleteSong(id);
  setSongs((prevSongs) => prevSongs.filter((song) => song._id !== id));
}

  return (
    <>
      <h1>Alle Songs</h1>

      <SongFilter
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {isLoading ? <p>Lade Songs...</p> : <SongList songs={songs} onDeleteSong={handleDeleteSong} />}
      
    </>
  );
}



