import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import SongFormPage from "./pages/SongFormPage";
import SongListPage from "./pages/SongListPage";
import SongDetailPage from "./pages/SongDetailPage";
import SongEditPage from "./pages/SongEditPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminUsersPage";
import VxExercisesPage from "./pages/VxExercisesPage";
import VxLevelPage from "./pages/VxLevelPage";
import ProfileBadge from "./components/ProfileBadge";
import RequireAuth from "./components/RequireAuth";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { nutzer } = useAuth();
  const location = useLocation();

  // AAA: Welcher Bereich ist offen? STYLES oder VX.
  const imVx = location.pathname.startsWith("/vx");
  const darfSchreiben = nutzer?.role === "admin" || nutzer?.role === "teacher";

  return (
    <main>
      <header className="top-bar">
        <img className="top-logo" src="/logo/wotasoft.svg" alt="wotasoft" />
        {nutzer && <ProfileBadge />}
      </header>

      <nav className="main-nav">
        <div className="nav-links">
          <Link className="brand" to="/">STYLES</Link>

          {nutzer && !imVx && (
            <>
              <NavLink to="/">[01] songs</NavLink>
              {darfSchreiben && <NavLink to="/new">[02] neu</NavLink>}
            </>
          )}

          <Link className="brand" to="/vx">VX</Link>

          {nutzer && imVx && (
            <>
              <NavLink to="/vx/exercises">[01] exercises</NavLink>
              <NavLink to="/vx/level">[02] level</NavLink>
            </>
          )}

          {!nutzer && <NavLink to="/login">anmelden</NavLink>}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><SongListPage /></RequireAuth>} />
        <Route path="/new" element={<RequireAuth rollen={["admin", "teacher"]}><SongFormPage /></RequireAuth>} />
        <Route path="/songs/:id" element={<RequireAuth><SongDetailPage /></RequireAuth>} />
        <Route path="/songs/:id/edit" element={<RequireAuth rollen={["admin", "teacher"]}><SongEditPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth rollen={["admin"]}><AdminPage /></RequireAuth>} />
        <Route path="/vx" element={<Navigate to="/vx/exercises" replace />} />
        <Route path="/vx/exercises" element={<RequireAuth><VxExercisesPage /></RequireAuth>} />
        <Route path="/vx/level" element={<RequireAuth><VxLevelPage /></RequireAuth>} />
      </Routes>
    </main>
  );
}
