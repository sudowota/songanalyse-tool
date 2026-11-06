import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SongForm, { type MiniDiscEingabe } from "../components/SongForm";
import SongMiniDisc, { baueDaten } from "../components/SongMiniDisc";
import { createSong, type CreateSongData } from "../api/songApi";

export default function SongFormPage() {
  const navigate = useNavigate();
  const [eingabe, setEingabe] = useState<MiniDiscEingabe>({
    titel: "",
    artist: "",
    tonart: "",
    tempo: "",
  });

  async function handleAddSong(data: CreateSongData) {
    await createSong(data);
    navigate("/");
  }

  return (
    <div className="song-layout">
      <div className="song-layout-main">
        <h1>Neuen Song analysieren</h1>
        <SongForm onAddSong={handleAddSong} onVorschau={setEingabe} />
      </div>

      <aside className="song-layout-side">
        <SongMiniDisc
          drehKey="neu"
          daten={baueDaten({
            titel: eingabe.titel,
            artist: eingabe.artist,
            tonart: eingabe.tonart,
            bpm: eingabe.tempo,
          })}
        />
      </aside>
    </div>
  );
}
