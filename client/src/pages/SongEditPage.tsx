import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SongForm, { type MiniDiscEingabe } from "../components/SongForm";
import SongMiniDisc, { baueDaten } from "../components/SongMiniDisc";
import { getSongById, updateSong, type CreateSongData } from "../api/songApi";
import type { Song } from "../types/song";

export default function SongEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eingabe, setEingabe] = useState<MiniDiscEingabe | null>(null);

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

  // Schritt 1: Solange das Formular noch nichts gemeldet hat, gelten die gespeicherten Werte
  const anzeige = eingabe ?? {
    titel: song.title,
    artist: song.artist,
    tonart: song.tonart ?? "",
    tempo: song.tempo !== undefined ? String(song.tempo) : "",
  };

  return (
    <div className="song-layout">
      <div className="song-layout-main">
        <Link className="back-link" to={`/songs/${song._id}`}>
          ← Zurück zur Detailansicht
        </Link>

        <h1>Song bearbeiten</h1>

        <SongForm
          onAddSong={handleUpdateSong}
          onVorschau={setEingabe}
          initialValues={{
            title: song.title,
            artist: song.artist,
            tempo: song.tempo,
            tonart: song.tonart ?? "",
            progression: song.progression,
            groove: song.groove,
            instruments: song.instruments,
            feeling: song.feeling,
            magicMoment: song.magicMoment,
            lyrics: song.lyrics,
            associations: song.associations,
          }}
          submitLabel="Änderungen speichern"
        />
      </div>

      <aside className="song-layout-side">
        <SongMiniDisc
          drehKey={song._id}
          daten={baueDaten({
            titel: anzeige.titel,
            artist: anzeige.artist,
            tonart: anzeige.tonart,
            bpm: anzeige.tempo,
            analysisStatus: song.analysisStatus,
            datum: song.updatedAt,
          })}
        />
      </aside>
    </div>
  );
}
