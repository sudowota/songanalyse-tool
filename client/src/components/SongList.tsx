import { Link } from "react-router-dom";
import type { Song } from "../types/song";

type SongListProps = {
  songs: Song[];
  onDeleteSong: (id: string) => Promise<void>;
  darfLoeschen?: boolean;
};

export default function SongList({ songs, onDeleteSong, darfLoeschen = false }: SongListProps) {
  if (songs.length === 0) {
    return <p className="empty-state">Keine Songs gefunden.</p>;
  }

  return (
    <div className="song-list">
      <h2>Gespeicherte Songs</h2>

      {songs.map((song) => (
        <article className="song-card" key={song._id}>

          <div className="song-card-body">
            <h3>{song.title}</h3>

            {song.artist && (
              <span className="badge badge-artist">{song.artist}</span>
            )}

            <div className="chip-row">
              <span className="badge">{song.tempo ?? "—"} BPM</span>
              <span className="badge">{song.progression || "—"}</span>
              <span className="badge">{song.groove || "—"}</span>
              <span className="badge">{song.feeling || "—"}</span>
            </div>

            <div className="button-row">
              <Link className="button-link" to={`/songs/${song._id}`}>
                Details
              </Link>

{darfLoeschen && (
              <button
                type="button"
                className="danger-button"
                onClick={() => onDeleteSong(song._id)}
              >
                Löschen
              </button>
            )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
