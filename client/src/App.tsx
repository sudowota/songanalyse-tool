import { Link, Route, Routes } from "react-router-dom";
import SongFormPage from "./pages/SongFormPage";
import SongListPage from "./pages/SongListPage";
import SongDetailPage from "./pages/SongDetailPage";
import SongEditPage from "./pages/SongEditPage";
import ProfileBadge from "./components/ProfileBadge";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <main>
      <header className="top-bar">
        <img className="top-logo" src="/logo/wotasoft.svg" alt="wotasoft" />
        <ProfileBadge />
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
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </main>
  );
}
