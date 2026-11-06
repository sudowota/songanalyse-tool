import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, saveProfile } from "../api/profileApi";
import { useAuth } from "../context/AuthContext";
import { pixelateImage } from "../utils/pixelate";
import ArtistBadge from "../components/ArtistBadge";
import ChangePasswordForm from "../components/ChangePasswordForm";

// AAA: Profilseite. Oben das große Badge, darunter die Einstellungen zum Hochladen.
export default function ProfilePage() {
  const { nutzer, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }
  const darfBearbeiten = nutzer?.role === "admin" || nutzer?.role === "teacher";
  const [gespeichertesBild, setGespeichertesBild] = useState("");

  const [datei, setDatei] = useState<File | null>(null);
  const [groesse, setGroesse] = useState(32);
  const [stufen, setStufen] = useState(4);
  const [vorschau, setVorschau] = useState("");
  const [meldung, setMeldung] = useState("");

  // Schritt 0: Aktuelles Badge-Bild laden
  useEffect(() => {
    getProfile()
      .then((bild) => setGespeichertesBild(bild))
      .catch(() => setGespeichertesBild(""));
  }, []);

  // Schritt 1: Bei jeder Änderung die Vorschau neu berechnen
  useEffect(() => {
    if (!datei) return;

    pixelateImage(datei, groesse, stufen)
      .then((bild) => setVorschau(bild))
      .catch(() => setMeldung("bild konnte nicht umgewandelt werden."));
  }, [datei, groesse, stufen]);

  // Schritt 2: Speichern mit Admin-Schlüssel
  async function handleSpeichern() {
    if (!vorschau) return;

    try {
      setMeldung("speichert...");
      await saveProfile(vorschau);
      setGespeichertesBild(vorschau);
      setMeldung("gespeichert. das badge zeigt jetzt das neue bild.");
    } catch (error) {
      const text = error instanceof Error ? error.message : "fehler";
      setMeldung(text);
    }
  }

  return (
    <>
      <Link className="back-link" to="/">
        ← zurück zur liste
      </Link>

      <div className="button-row">
        <button type="button" onClick={handleLogout}>
          [x] abmelden
        </button>
      </div>

      <h1>profil</h1>

      <div className="profile-badge-stage">
        <ArtistBadge
          config={gespeichertesBild ? { bildSrc: gespeichertesBild } : undefined}
        />
      </div>

      <ChangePasswordForm />

      {darfBearbeiten && (
      <section className="window-outer">
      <h2>badge-einstellungen</h2>

      <div className="form-grid">
        <div className="form-group form-group-wide">
          <label>foto wählen</label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => setDatei(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="form-group">
          <label>auflösung: {groesse} px</label>
          <input
            type="range"
            min={16}
            max={64}
            step={8}
            value={groesse}
            onChange={(e) => setGroesse(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>farbstufen: {stufen}</label>
          <input
            type="range"
            min={2}
            max={6}
            value={stufen}
            onChange={(e) => setStufen(Number(e.target.value))}
          />
        </div>

        <div className="form-group form-group-wide">
          <label>vorschau</label>
          {vorschau ? (
            <img
              className="badge-preview"
              src={vorschau}
              alt="pixel-vorschau"
            />
          ) : (
            <p>noch kein bild gewählt.</p>
          )}
        </div>
      </div>

      <div className="button-row">
        <button type="button" onClick={handleSpeichern} disabled={!vorschau}>
          badge speichern
        </button>
      </div>

      {meldung && <p className="form-error">{meldung}</p>}
      </section>
      )}
    </>
  );
}
