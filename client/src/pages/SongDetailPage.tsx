import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getSongById } from "../api/songApi";
import type { Song } from "../types/song";

export default function SongDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <section className="song-detail">
      <Link className="back-link" to="/">
        ← Zurück zur Liste
      </Link>

      <Link className="button-link" to={`/songs/${song._id}/edit`}>
        Bearbeiten
      </Link>

      <header className="song-detail-hero">
        <div>
          <p className="eyebrow">Blue Notes</p>
          <h1>{song.title}</h1>
          {song.artist && <p className="artist-name">{song.artist}</p>}
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
    </section>
  );
}