import { Link, Route, Routes } from "react-router-dom";
import SongFormPage from "./pages/SongFormPage";
import SongListPage from "./pages/SongListPage";
import SongDetailPage from "./pages/SongDetailPage";
import SongEditPage from "./pages/SongEditPage";

export default function App() {
  return (
    <main>
      <header className="top-logo">
        <img src="/logo/wotasoft.svg" alt="wotasoft" />
      </header>

      <nav>
        <Link className="brand" to="/">
          style
        </Link>

        <div>
          <Link to="/">[01] songs</Link>{" "}
          <Link to="/new">[02] neu</Link>
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
