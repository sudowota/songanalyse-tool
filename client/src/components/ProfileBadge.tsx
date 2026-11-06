import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../api/profileApi";
import { artistBadgeConfig } from "../config/artistBadge";
import { useAuth } from "../context/AuthContext";

// AAA: Kleines Badge in der Kopfzeile. Ein Klick öffnet Admin-Bereich oder Profil.
export default function ProfileBadge() {
  const [gespeichertesBild, setGespeichertesBild] = useState("");

  // Schritt 1: Gespeichertes Badge-Bild laden, sonst bleibt der Platzhalter
  useEffect(() => {
    getProfile()
      .then((bild) => setGespeichertesBild(bild))
      .catch(() => setGespeichertesBild(""));
  }, []);

  const { nutzer } = useAuth();
  const bildQuelle = gespeichertesBild || artistBadgeConfig.bildSrc;
  // Admins landen zuerst im Admin-Bereich, alle anderen im Profil
  const ziel = nutzer?.role === "admin" ? "/admin" : "/profile";

  return (
    <Link className="mini-badge" to={ziel} aria-label="öffnen">
      <img src={bildQuelle} alt="" />
    </Link>
  );
}
