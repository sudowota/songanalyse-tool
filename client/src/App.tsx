import { Link, Route, Routes } from "react-router-dom";
import SongFormPage from "./pages/SongFormPage";
import SongListPage from "./pages/SongListPage";
import SongDetailPage from "./pages/SongDetailPage";
import SongEditPage from "./pages/SongEditPage";

export default function App() {
  return (
    <main>
      <nav>
        <Link className="brand" to="/">
          Blue Notes
        </Link>

        <div>
          <Link to="/">Songs</Link>{" "}
          <Link to="/new">+ Neuer Song</Link>
        </div>
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
