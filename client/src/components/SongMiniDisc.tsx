import { miniDiscConfig as c } from "../config/songMiniDisc";

export type MiniDiscDaten = {
  titel: string;
  artist: string;
  tonart: string;
  bpm: string;
  status: string;
  datum: string;
};

type SongMiniDiscProps = {
  daten: MiniDiscDaten;
  // Wenn sich dieser Wert ändert, dreht sich die Disc einmal (z. B. Song-ID)
  drehKey: string;
};

// AAA: Status aus dem bestehenden Feld analysisStatus, lesbar übersetzt.
export function statusText(analysisStatus?: string): string {
  // Schritt 1: Noch kein Status (neuer Song) gilt als offen
  if (analysisStatus === undefined || analysisStatus === "offen") {
    return "IN PROGRESS";
  }
  // Schritt 2: Analysiert
  if (analysisStatus === "analysiert") {
    return "ANALYZED";
  }
  return c.leer;
}

// AAA: Datum als Text. Ohne Datum (neuer Song) heute.
export function datumText(iso?: string): string {
  if (!iso) {
    return new Date().toLocaleDateString("de-DE");
  }
  return new Date(iso).toLocaleDateString("de-DE");
}

// AAA: Baut aus den Rohdaten eines Songs die Anzeige-Daten für die MiniDisc.
export function baueDaten(roh: {
  titel: string;
  artist: string;
  tonart: string;
  bpm: string;
  analysisStatus?: string;
  datum?: string;
}): MiniDiscDaten {
  return {
    titel: roh.titel,
    artist: roh.artist,
    tonart: roh.tonart,
    bpm: roh.bpm,
    status: statusText(roh.analysisStatus),
    datum: datumText(roh.datum),
  };
}

// AAA: Leere Felder bekommen einen Platzhalter.
function wertOderLeer(wert: string): string {
  if (wert.trim() === "") {
    return c.leer;
  }
  return wert;
}

export default function SongMiniDisc({ daten }: SongMiniDiscProps) {
  return (
    <div className="minidisc">
      <div className="minidisc-shell">
        <img className="minidisc-bild" src="/minidisc/md.svg" alt="" />
      </div>

      <div className="minidisc-info">
        <p className="minidisc-untertitel">{wertOderLeer(daten.titel)}</p>

        <dl>
          <div className="minidisc-row">
            <dt>{c.labels.artist}</dt>
            <dd>{wertOderLeer(daten.artist)}</dd>
          </div>
          <div className="minidisc-row">
            <dt>{c.labels.key}</dt>
            <dd>{wertOderLeer(daten.tonart)}</dd>
          </div>
          <div className="minidisc-row">
            <dt>{c.labels.bpm}</dt>
            <dd>{wertOderLeer(daten.bpm)}</dd>
          </div>
          <div className="minidisc-row">
            <dt>{c.labels.status}</dt>
            <dd>{wertOderLeer(daten.status)}</dd>
          </div>
          <div className="minidisc-row">
            <dt>{c.labels.datum}</dt>
            <dd>{wertOderLeer(daten.datum)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
