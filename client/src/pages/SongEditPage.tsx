import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SongForm from "../components/SongForm";
import { getSongById, updateSong, type CreateSongData } from "../api/songApi";
import type { Song } from "../types/song";

export default function SongEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSong() {
      try {
        if (!id) return;

        const data = await getSongById(id);
        setSong(data);
      } catch (error) {
        console.error("Fehler beim Laden des Songs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSong();
  }, [id]);

  async function handleUpdateSong(data: CreateSongData) {
    if (!id) return;

    await updateSong(id, data);
    navigate(`/songs/${id}`);
  }

  if (isLoading) return <p>Lade Song...</p>;
  if (!song) return <p>Song nicht gefunden.</p>;

  return (
    <>
      <Link className="back-link" to={`/songs/${song._id}`}>
        ← Zurück zur Detailansicht
      </Link>

      <h1>Song bearbeiten</h1>

      <SongForm
        onAddSong={handleUpdateSong}
        initialValues={{
          title: song.title,
          artist: song.artist,
          tempo: song.tempo,
          progression: song.progression,
          groove: song.groove,
          instruments: song.instruments,
          feeling: song.feeling,
          associations: song.associations,
        }}
        submitLabel="Änderungen speichern"
      />
    </>
  );
}