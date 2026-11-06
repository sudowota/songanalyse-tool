import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../api/profileApi";
import { artistBadgeConfig } from "../config/artistBadge";

// AAA: Kleines Badge in der Kopfzeile. Ein Klick öffnet die Profilseite.
export default function ProfileBadge() {
  const [gespeichertesBild, setGespeichertesBild] = useState("");

  // Schritt 1: Gespeichertes Badge-Bild laden, sonst bleibt der Platzhalter
  useEffect(() => {
    getProfile()
      .then((bild) => setGespeichertesBild(bild))
      .catch(() => setGespeichertesBild(""));
  }, []);

  const bildQuelle = gespeichertesBild || artistBadgeConfig.bildSrc;

  return (
    <Link className="mini-badge" to="/profile" aria-label="profil öffnen">
      <img src={bildQuelle} alt="" />
    </Link>
  );
}
