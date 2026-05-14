import { Link, Route, Routes } from "react-router-dom";
import SongFormPage from "./pages/SongFormPage";
import SongListPage from "./pages/SongListPage";
import SongDetailPage from "./pages/SongDetailPage";
import SongEditPage from "./pages/SongEditPage";

export default function App() {
  return (
    <main>
      <nav>
        <Link to="/">Songs</Link> |{" "}
        <Link to="/new">Neuen Song anlegen</Link>
      </nav>

      <Routes>
        <Route path="/" element={<SongListPage />} />
        <Route path="/new" element={<SongFormPage />} />
        <Route path="/songs/:id" element={<SongDetailPage />} />
        <Route path="/songs/:id/edit" element={<SongEditPage />} />
      </Routes>
    </main>
  );
}