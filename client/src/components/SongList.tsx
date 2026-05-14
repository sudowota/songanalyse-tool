import { Link } from "react-router-dom";
import type { Song } from "../types/song";

type SongListProps = {
  songs: Song[];
  onDeleteSong: (id: string) => Promise<void>;
};

export default function SongList({ songs, onDeleteSong }: SongListProps) {
  if (songs.length === 0) {
    return <p>Keine Songs gefunden.</p>;
  }

  return (
    <div>
      <h2>Gespeicherte Songs</h2>

      {songs.map((song) => (
        <article key={song._id}>
          <h3>
            {song.title} {song.artist && `– ${song.artist}`}
          </h3>

          <p>
            <strong>Tempo:</strong> {song.tempo ?? "—"}
          </p>
          <p>
            <strong>Progression:</strong> {song.progression || "—"}
          </p>
          <p>
            <strong>Groove:</strong> {song.groove || "—"}
          </p>
          <p>
            <strong>Feeling:</strong> {song.feeling || "—"}
          </p>

          <div className="button-row">
            <Link className="button-link" to={`/songs/${song._id}`}>
              Details
            </Link>

            <button
              type="button"
              className="danger-button"
              onClick={() => onDeleteSong(song._id)}
            >
              Löschen
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}