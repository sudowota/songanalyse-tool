import { useState } from "react";
import ArtistBadge from "./ArtistBadge";
import { artistBadgeConfig } from "../config/artistBadge";

// AAA: Kleines Badge in der Kopfzeile. Ein Klick öffnet die volle Karte.
export default function ProfileBadge() {
  const [istOffen, setIstOffen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mini-badge"
        onClick={() => setIstOffen(true)}
        aria-label="profil-badge öffnen"
      >
        <img src={artistBadgeConfig.bildSrc} alt="" />
        <span>{artistBadgeConfig.name}</span>
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
            <ArtistBadge />
          </div>
        </div>
      )}
    </>
  );
}
