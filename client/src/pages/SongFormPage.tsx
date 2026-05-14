import { useNavigate } from "react-router-dom";
import SongForm from "../components/SongForm";
import { createSong, type CreateSongData } from "../api/songApi";

export default function SongFormPage() {
  const navigate = useNavigate();

  async function handleAddSong(data: CreateSongData) {
    await createSong(data);
    navigate("/");
  }

  return (
    <>
      <h1>Neuen Song analysieren</h1>
      <SongForm onAddSong={handleAddSong} />
    </>
  );
}