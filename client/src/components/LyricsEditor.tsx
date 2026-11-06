import { useRef, useState } from "react";
import LyricsView from "./LyricsView";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // AAA: Fügt einen Text an der aktuellen Cursorposition ein
  function fuegeAnCursorEin(einfuegen: string) {
    const feld = textareaRef.current;

    // Schritt 1: Gibt es kein Textfeld, hängen wir einfach ans Ende an
    if (!feld) {
      setText(text + einfuegen);
      return;
    }

    // Schritt 2: Cursorposition merken und Text an dieser Stelle einfügen
    const start = feld.selectionStart;
    const ende = feld.selectionEnd;
    const neuerText = text.slice(0, start) + einfuegen + text.slice(ende);
    setText(neuerText);

    // Schritt 3: Cursor hinter den eingefügten Text setzen
    const neuePosition = start + einfuegen.length;
    requestAnimationFrame(() => {
      feld.focus();
      feld.setSelectionRange(neuePosition, neuePosition);
    });
  }

  // AAA: Abschnittsmarker mit Zeilenumbrüchen davor und danach
  function fuegeMarkerEin(marker: string) {
    fuegeAnCursorEin("\n" + marker + "\n");
  }

  // AAA: Leerzeile als Abstand zwischen Zeilen oder Abschnitten
  function fuegeLeerzeileEin() {
    fuegeAnCursorEin("\n");
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
          <button type="button" onClick={fuegeLeerzeileEin}>
            [+] leerzeile
          </button>
        </div>

        <div className="lyrics-panes">
          <div className="lyrics-pane">
            <p className="lyrics-pane-label">eingabe</p>
            <textarea
              ref={textareaRef}
              className="lyrics-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="songtext hier eingeben. leerzeile = abstand zwischen abschnitten."
            />
          </div>

          <div className="lyrics-pane">
            <p className="lyrics-pane-label">vorschau</p>
            <div className="lyrics-preview">
              <LyricsView text={text} />
            </div>
          </div>
        </div>

        <div className="button-row">
          <button type="button" onClick={() => onSave(text)}>
            speichern
          </button>
          <button type="button" className="secondary-button" onClick={onClose}>
            abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
