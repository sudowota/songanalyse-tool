import {
  artistBadgeConfig,
  type ArtistBadgeConfig,
} from "../config/artistBadge";

type ArtistBadgeProps = {
  config?: Partial<ArtistBadgeConfig>;
};

// AAA: Retro-Ausweis im Pixel-Stil. Alles ist echtes HTML und CSS,
// damit Texte, Schriften und das Bild einfach austauschbar bleiben.
export default function ArtistBadge({ config }: ArtistBadgeProps) {
  // Schritt 1: Standardwerte mit eigenen Angaben zusammenführen
  const daten = { ...artistBadgeConfig, ...config };

  return (
    <div className="artist-badge">
      <div className="artist-badge-clip" aria-hidden="true" />

      <div className="artist-badge-frame">
        <div className="artist-badge-inner">
          <div className="artist-badge-head">
            <h3 className="artist-badge-title">{daten.titel}</h3>
            <span className="artist-badge-id">{daten.idNummer}</span>
          </div>

          <p className="artist-badge-sub">{daten.untertitel}</p>

          <div className="artist-badge-photo">
            <img src={daten.bildSrc} alt={daten.bildAlt} />
          </div>

          <dl className="artist-badge-rows">
            <div className="artist-badge-row">
              <dt>NAME</dt>
              <dd>{daten.name}</dd>
            </div>
            <div className="artist-badge-row">
              <dt>OCCUPATION</dt>
              <dd>{daten.beruf}</dd>
            </div>
            <div className="artist-badge-row">
              <dt>STYLE</dt>
              <dd>{daten.stil}</dd>
            </div>
            <div className="artist-badge-row">
              <dt>LEVEL</dt>
              <dd>{daten.level}</dd>
            </div>
          </dl>

          <div className="artist-badge-foot">
            <span>{daten.fusszeile}</span>
            <strong>{daten.easterEgg}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
