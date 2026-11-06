import { useState } from "react";

type LyricsEditorProps = {
  initialText: string;
  onSave: (text: string) => void;
  onClose: () => void;
};

// AAA: Abschnittsmarker, die man per Knopfdruck einfügen kann
const abschnitte = ["[Intro]", "[Verse]", "[Pre-Chorus]", "[Chorus]", "[Bridge]", "[Outro]"];

export default function LyricsEditor({
  initialText,
  onSave,
  onClose,
}: LyricsEditorProps) {
  const [text, setText] = useState(initialText);

  // AAA: Fügt einen Abschnittsmarker ans Ende des Textes an
  function fuegeMarkerEin(marker: string) {
    // Schritt 1: Ist schon Text vorhanden?
    if (text.trim() === "") {
      setText(marker + "\n");
    } else {
      // Schritt 2: Sonst mit Leerzeile trennen
      setText(text + "\n\n" + marker + "\n");
    }
  }

  return (
    <div className="lyrics-overlay" role="dialog" aria-modal="true">
      <div className="lyrics-window">
        <div className="lyrics-titlebar">
          <span>lyrics-editor</span>
          <button type="button" onClick={onClose}>
            [x] schließen
          </button>
        </div>

        <div className="lyrics-toolbar">
          {abschnitte.map((marker) => (
            <button
              key={marker}
              type="button"
              onClick={() => fuegeMarkerEin(marker)}
            >
              {marker}
            </button>
          ))}
        </div>

        <textarea
          className="lyrics-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="songtext hier eingeben. leerzeile = abstand zwischen abschnitten."
        />

        <div className="button-row">
          <button type="button" onClick={() => onSave(text)}>
            speichern
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
