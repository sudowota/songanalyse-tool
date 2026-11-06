import { useEffect, useState, type FormEvent } from "react";
import { createUser, listUsers, type NutzerZeile } from "../api/userApi";
import type { Rolle } from "../api/authApi";

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
      setMeldung("konto angelegt.");
      await ladeNutzer();
    } catch (error) {
      setMeldung(error instanceof Error ? error.message : "fehler beim anlegen.");
    }
  }

  return (
    <>
      <h1>nutzer</h1>

      <section className="window-outer">
        <h2>neues konto</h2>

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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button type="submit">konto anlegen</button>
        </form>

        {meldung && <p className="form-error">{meldung}</p>}
      </section>

      <section className="window-outer">
        <h2>alle konten</h2>

        {nutzer.length === 0 ? (
          <p>keine konten vorhanden.</p>
        ) : (
          <div className="song-list">
            {nutzer.map((zeile) => (
              <div className="song-card" key={zeile._id}>
                <div className="song-card-body">
                  <h3>{zeile.username}</h3>
                  <div className="chip-row">
                    <span className="badge">{zeile.role}</span>
                    {zeile.name && <span className="badge">{zeile.name}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
