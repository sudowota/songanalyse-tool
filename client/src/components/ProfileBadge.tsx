import { useEffect, useState } from "react";
import { getProfile } from "../api/profileApi";
import ArtistBadge from "./ArtistBadge";
import { artistBadgeConfig } from "../config/artistBadge";

// AAA: Kleines Badge in der Kopfzeile. Ein Klick öffnet die volle Karte.
export default function ProfileBadge() {
  const [istOffen, setIstOffen] = useState(false);
  const [gespeichertesBild, setGespeichertesBild] = useState("");

  // Schritt 1: Gespeichertes Badge-Bild laden, sonst bleibt der Platzhalter
  useEffect(() => {
    getProfile()
      .then((bild) => setGespeichertesBild(bild))
      .catch(() => setGespeichertesBild(""));
  }, []);

  const bildQuelle = gespeichertesBild || artistBadgeConfig.bildSrc;

  return (
    <>
      <button
        type="button"
        className="mini-badge"
        onClick={() => setIstOffen(true)}
        aria-label="profil-badge öffnen"
      >
        <img src={bildQuelle} alt="" />
      </button>

      {istOffen && (
        <div className="badge-overlay" onClick={() => setIstOffen(false)}>
          <div
            className="badge-overlay-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="secondary-button"
              onClick={() => setIstOffen(false)}
            >
              [x] schließen
            </button>
            <ArtistBadge config={gespeichertesBild ? { bildSrc: gespeichertesBild } : undefined} />
          </div>
        </div>
      )}
    </>
  );
}
