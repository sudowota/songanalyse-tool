import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSongById } from "../api/songApi";
import type { Song } from "../types/song";
import LyricsView from "../components/LyricsView";
import { useAuth } from "../context/AuthContext";
import SongMiniDisc, { baueDaten } from "../components/SongMiniDisc";

export default function SongDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { nutzer } = useAuth();
  const darfBearbeiten = nutzer?.role === "admin" || nutzer?.role === "teacher";
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zeigeLyrics, setZeigeLyrics] = useState(false);

  useEffect(() => {
    async function loadSong() {
      try {
        if (!id) return;
        const data = await getSongById(id);
        setSong(data);
      } finally {
        setIsLoading(false);
      }
    }

    loadSong();
  }, [id]);

  if (isLoading) return <p>Lade Song...</p>;
  if (!song) return <p>Song nicht gefunden.</p>;

  return (
    <section className="window-outer song-detail">
      <div className="song-layout">
      <div className="song-layout-main">
      <Link className="back-link" to="/">
        ← Zurück zur Liste
      </Link>
      {darfBearbeiten && (<Link className="button-link" to={`/songs/${song._id}/edit`}>
          Bearbeiten
        </Link>)}

        <header className="song-detail-hero">
          <div className="song-hero-main">

            <div>
              <p className="eyebrow">Blue Notes</p>
              <h1>{song.title}</h1>
              {song.artist && (
                <span className="badge badge-artist">{song.artist}</span>
              )}
            </div>
          </div>

          <div className="bpm-badge">
            <span>{song.tempo ?? "—"}</span>
            <small>BPM</small>
          </div>
        </header>

        <div className="detail-section">
          <h2>Musikalische DNA</h2>

          <div className="detail-grid">
            <div className="detail-item">
              <span>Progression</span>
              <strong>{song.progression || "—"}</strong>
            </div>

            <div className="detail-item">
              <span>Groove</span>
              <strong>{song.groove || "—"}</strong>
            </div>

            <div className="detail-item">
              <span>Feeling</span>
              <strong>{song.feeling || "—"}</strong>
            </div>

            <div className="detail-item">
              <span>Status</span>
              <strong>{song.analysisStatus}</strong>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h2>Magic Moments</h2>
          <p className="magic-moment-text">
            {song.magicMoment || "Noch keine Magic Moments notiert."}
          </p>
        </div>

        <div className="detail-section">
          <h2>lyrics</h2>
          <button type="button" onClick={() => setZeigeLyrics(!zeigeLyrics)}>
            {zeigeLyrics ? "ausblenden" : "anzeigen"}
          </button>
          {zeigeLyrics && <LyricsView text={song.lyrics} />}
        </div>

        <div className="detail-section">
          <h2>Instruments</h2>
          <div className="tag-list">
            {song.instruments.length > 0
              ? song.instruments.map((instrument) => (
                  <span className="tag" key={instrument}>
                    {instrument}
                  </span>
                ))
              : "—"}
          </div>
        </div>

        <div className="detail-section">
          <h2>Assoziationen</h2>
          <div className="tag-list">
            {song.associations.length > 0
              ? song.associations.map((association) => (
                  <span className="tag" key={association}>
                    {association}
                  </span>
                ))
              : "—"}
          </div>
        </div>
      </div>

      <aside className="song-layout-side">
        <SongMiniDisc
          drehKey={song._id}
          daten={baueDaten({
            titel: song.title,
            artist: song.artist,
            tonart: song.tonart ?? "",
            bpm: song.tempo !== undefined ? String(song.tempo) : "",
            analysisStatus: song.analysisStatus,
            datum: song.updatedAt,
          })}
        />
      </aside>
      </div>
    </section>
  );
}
