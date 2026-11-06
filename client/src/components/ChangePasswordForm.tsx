import { useState, type FormEvent } from "react";
import { changePassword } from "../api/authApi";
import PasswordInput from "./PasswordInput";

// AAA: Formular zum Ändern des eigenen Passworts.
export default function ChangePasswordForm() {
  const [altesPasswort, setAltesPasswort] = useState("");
  const [neuesPasswort, setNeuesPasswort] = useState("");
  const [wiederholung, setWiederholung] = useState("");
  const [meldung, setMeldung] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMeldung("");

    // Schritt 1: Die neuen Passwörter müssen gleich sein
    if (neuesPasswort !== wiederholung) {
      setMeldung("die neuen passwörter stimmen nicht überein.");
      return;
    }

    // Schritt 2: An den Server schicken
    try {
      const text = await changePassword(altesPasswort, neuesPasswort);
      setMeldung(text);
      setAltesPasswort("");
      setNeuesPasswort("");
      setWiederholung("");
    } catch (error) {
      setMeldung(error instanceof Error ? error.message : "fehler.");
    }
  }

  return (
    <section className="window-outer">
      <h2>passwort ändern</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group form-group-wide">
            <label>altes passwort</label>
            <PasswordInput
              value={altesPasswort}
              onChange={setAltesPasswort}
              autoComplete="current-password"
            />
          </div>

          <div className="form-group">
            <label>neues passwort (min. 8 zeichen)</label>
            <PasswordInput
              value={neuesPasswort}
              onChange={setNeuesPasswort}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label>neues passwort wiederholen</label>
            <PasswordInput
              value={wiederholung}
              onChange={setWiederholung}
              autoComplete="new-password"
            />
          </div>
        </div>

        <button type="submit">passwort speichern</button>
      </form>

      {meldung && <p className="form-error">{meldung}</p>}
    </section>
  );
}
