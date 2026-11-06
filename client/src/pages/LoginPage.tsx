import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLaedt(true);
    setFehler("");

    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (error) {
      const text = error instanceof Error ? error.message : "anmelden fehlgeschlagen.";
      setFehler(text);
    } finally {
      setLaedt(false);
    }
  }

  return (
    <section className="window-outer">
      <h2>anmelden</h2>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>benutzername</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="form-group">
            <label>passwort</label>
            <PasswordInput
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
          </div>
        </div>

        {fehler && <p className="form-error">{fehler}</p>}

        <button type="submit" disabled={laedt}>
          {laedt ? "prüft..." : "anmelden"}
        </button>
      </form>
    </section>
  );
}
