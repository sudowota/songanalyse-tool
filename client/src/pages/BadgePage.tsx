import { useEffect, useState } from "react";
import { saveProfile } from "../api/profileApi";
import { pixelateImage } from "../utils/pixelate";

// AAA: Seite zum Hochladen. Foto wählen, Stärke einstellen, speichern.
export default function BadgePage() {
  const [datei, setDatei] = useState<File | null>(null);
  const [groesse, setGroesse] = useState(32);
  const [stufen, setStufen] = useState(4);
  const [vorschau, setVorschau] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [meldung, setMeldung] = useState("");

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
      await saveProfile(vorschau, adminKey);
      setMeldung("gespeichert. die startseite zeigt das neue badge.");
    } catch (error) {
      const text = error instanceof Error ? error.message : "fehler";
      setMeldung(text);
    }
  }

  return (
    <section className="window-outer">
      <h2>badge-bild</h2>

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

        <div className="form-group form-group-wide">
          <label>admin-schlüssel</label>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />
        </div>
      </div>

      <div className="button-row">
        <button type="button" onClick={handleSpeichern} disabled={!vorschau}>
          badge speichern
        </button>
      </div>

      {meldung && <p className="form-error">{meldung}</p>}
    </section>
  );
}
