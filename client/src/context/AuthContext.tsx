import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearToken, fetchMe, login as loginApi, type Nutzer } from "../api/authApi";

type AuthWert = {
  nutzer: Nutzer | null;
  laedt: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthWert | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [nutzer, setNutzer] = useState<Nutzer | null>(null);
  const [laedt, setLaedt] = useState(true);

  // Schritt 1: Beim Start prüfen, ob noch eine gültige Sitzung besteht
  useEffect(() => {
    fetchMe()
      .then((n) => setNutzer(n))
      .finally(() => setLaedt(false));
  }, []);

  async function login(username: string, password: string) {
    const angemeldet = await loginApi(username, password);
    setNutzer(angemeldet);
  }

  function logout() {
    clearToken();
    setNutzer(null);
  }

  return (
    <AuthContext.Provider value={{ nutzer, laedt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthWert {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth muss innerhalb von AuthProvider genutzt werden.");
  }
  return ctx;
}
