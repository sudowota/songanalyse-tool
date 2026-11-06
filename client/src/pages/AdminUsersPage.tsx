import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { createUser, listUsers, resetUserPassword, type NutzerZeile } from "../api/userApi";
import type { Rolle } from "../api/authApi";
import PasswordInput from "../components/PasswordInput";

// AAA: Eine Zeile mit Konto-Daten und Button zum Passwort-Zurücksetzen.
function ResetRow({
  zeile,
  onMeldung,
}: {
  zeile: NutzerZeile;
  onMeldung: (text: string) => void;
}) {
  const [offen, setOffen] = useState(false);
  const [neuesPasswort, setNeuesPasswort] = useState("");

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const text = await resetUserPassword(zeile._id, neuesPasswort);
      onMeldung(`${zeile.username}: ${text}`);
      setNeuesPasswort("");
      setOffen(false);
    } catch (error) {
      onMeldung(error instanceof Error ? error.message : "fehler beim zurücksetzen.");
    }
  }

  return (
    <div className="song-card">
      <div className="song-card-body">
        <h3>{zeile.username}</h3>
        <div className="chip-row">
          <span className="badge">{zeile.role}</span>
          {zeile.name && <span className="badge">{zeile.name}</span>}
        </div>

        {!offen ? (
          <div className="button-row">
            <button type="button" onClick={() => setOffen(true)}>
              passwort zurücksetzen
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={handleReset}>
            <div className="form-group">
              <label>neues passwort (min. 8 zeichen)</label>
              <PasswordInput
                value={neuesPasswort}
                onChange={setNeuesPasswort}
                autoComplete="new-password"
              />
            </div>
            <div className="button-row">
              <button type="submit">speichern</button>
              <button type="button" className="secondary-button" onClick={() => setOffen(false)}>
                abbrechen
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// AAA: Nutzerverwaltung. Admins sehen alle Konten und legen neue an.
export default function AdminUsersPage() {
  const [nutzer, setNutzer] = useState<NutzerZeile[]>([]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Rolle>("student");
  const [meldung, setMeldung] = useState("");

  async function ladeNutzer() {
    try {
      setNutzer(await listUsers());
    } catch (error) {
      setMeldung(error instanceof Error ? error.message : "fehler beim laden.");
    }
  }

  useEffect(() => {
    ladeNutzer();
  }, []);

  async function handleAnlegen(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMeldung("");

    try {
      await createUser({ username, password, name, role });
      setUsername("");
      setName("");
      setPassword("");
      setRole("student");
      setMeldung("user angelegt.");
      await ladeNutzer();
    } catch (error) {
      setMeldung(error instanceof Error ? error.message : "fehler beim anlegen.");
    }
  }

  return (
    <>
      <h1>admin</h1>

      <div className="button-row">
        <Link className="button-link" to="/profile">zum profil</Link>
      </div>

      <h2>user</h2>

      <section className="window-outer">
        <h2>neuer user</h2>

        <form className="form" onSubmit={handleAnlegen}>
          <div className="form-grid">
            <div className="form-group">
              <label>benutzername</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="form-group">
              <label>name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>passwort (min. 8 zeichen)</label>
              <PasswordInput
                value={password}
                onChange={setPassword}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label>rolle</label>
              <select value={role} onChange={(e) => setRole(e.target.value as Rolle)}>
                <option value="student">student</option>
                <option value="teacher">teacher</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>

          <button type="submit">user anlegen</button>
        </form>

        {meldung && <p className="form-error">{meldung}</p>}
      </section>

      <section className="window-outer">
        <h2>alle user</h2>

        {nutzer.length === 0 ? (
          <p>keine user vorhanden.</p>
        ) : (
          <div className="song-list">
            {nutzer.map((zeile) => (
              <ResetRow
                key={zeile._id}
                zeile={zeile}
                onMeldung={setMeldung}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
