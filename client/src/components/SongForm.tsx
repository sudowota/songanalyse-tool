import { useEffect, useState } from "react";
import type { CreateSongData } from "../api/songApi";
import LyricsEditor from "./LyricsEditor";

// AAA: Was das Formular live an die MiniDisc meldet.
export type MiniDiscEingabe = {
  titel: string;
  artist: string;
  tonart: string;
  tempo: string;
};

type SongFormProps = {
  onAddSong: (data: CreateSongData) => Promise<void>;
  initialValues?: Partial<CreateSongData>;
  submitLabel?: string;
  onVorschau?: (eingabe: MiniDiscEingabe) => void;
};

export default function SongForm({
  onAddSong,
  initialValues,
  submitLabel = "song speichern",
  onVorschau,
}: SongFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [artist, setArtist] = useState(initialValues?.artist ?? "");
  const [tempo, setTempo] = useState(
    initialValues?.tempo ? String(initialValues.tempo) : ""
  );
  const [tonart, setTonart] = useState(initialValues?.tonart ?? "");
  const [progression, setProgression] = useState(
    initialValues?.progression ?? ""
  );
  const [groove, setGroove] = useState(initialValues?.groove ?? "");
  const [instruments, setInstruments] = useState(
    initialValues?.instruments?.join(", ") ?? ""
  );
  const [feeling, setFeeling] = useState(initialValues?.feeling ?? "");
  const [magicMoment, setMagicMoment] = useState(
    initialValues?.magicMoment ?? ""
  );
  const [lyrics, setLyrics] = useState(initialValues?.lyrics ?? "");
  const [associations, setAssociations] = useState(
    initialValues?.associations?.join(", ") ?? ""
  );
  const [istEditorOffen, setIstEditorOffen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fehler, setFehler] = useState("");

  // Schritt 1: Jede Änderung der Kerndaten sofort an die MiniDisc melden
  useEffect(() => {
    if (onVorschau) {
      onVorschau({ titel: title, artist, tonart, tempo });
    }
  }, [title, artist, tonart, tempo]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.trim() === "") return;

    const formData: CreateSongData = {
      title: title.trim(),
      artist: artist.trim(),
      tempo: tempo.trim() ? Number(tempo) : undefined,
      progression: progression.trim(),
      groove: groove.trim(),
      instruments: instruments
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      feeling: feeling.trim(),
      magicMoment: magicMoment.trim(),
      tonart: tonart.trim(),
      lyrics: lyrics,
      associations: associations
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      setIsSubmitting(true);
      setFehler("");
      await onAddSong(formData);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      setFehler(
        "speichern fehlgeschlagen. läuft das backend (port 5001) und ist die datenbank erreichbar?"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="window-outer">
      <form className="form" onSubmit={handleSubmit}>
        <h2>song analysieren</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>songtitel</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="form-group">
            <label>artist</label>
            <input value={artist} onChange={(e) => setArtist(e.target.value)} />
          </div>

          <div className="form-group">
            <label>tonart</label>
            <input
              value={tonart}
              onChange={(e) => setTonart(e.target.value)}
              placeholder="z.b. f#m"
            />
          </div>

          <div className="form-group">
            <label>tempo</label>
            <input
              type="number"
              value={tempo}
              onChange={(e) => setTempo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>progression</label>
            <input
              value={progression}
              onChange={(e) => setProgression(e.target.value)}
              placeholder="z.b. i-v-vi-iv"
            />
          </div>

          <div className="form-group">
            <label>groove</label>
            <input value={groove} onChange={(e) => setGroove(e.target.value)} />
          </div>

          <div className="form-group">
            <label>instruments</label>
            <input
              value={instruments}
              onChange={(e) => setInstruments(e.target.value)}
              placeholder="piano, bass, drums"
            />
          </div>

          <div className="form-group">
            <label>feeling</label>
            <input value={feeling} onChange={(e) => setFeeling(e.target.value)} />
          </div>

          <div className="form-group">
            <label>assoziationen</label>
            <input
              value={associations}
              onChange={(e) => setAssociations(e.target.value)}
              placeholder="nachtfahrt, sommer, wehmut"
            />
          </div>

          <div className="form-group form-group-wide">
            <label>magic moment</label>
            <textarea
              value={magicMoment}
              onChange={(e) => setMagicMoment(e.target.value)}
              rows={3}
              placeholder="was gefällt mir besonders? wo sind die magic moments?"
            />
          </div>

          <div className="form-group form-group-wide">
            <label>lyrics</label>
            <div className="lyrics-row">
              <textarea
                className="lyrics-input"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                rows={6}
                placeholder="songtext hier einfügen"
              />
              <button type="button" onClick={() => setIstEditorOffen(true)}>
                editor öffnen
              </button>
            </div>
          </div>
        </div>

        {fehler && <p className="form-error">{fehler}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "speichert..." : submitLabel}
        </button>
      </form>

      {istEditorOffen && (
        <LyricsEditor
          initialText={lyrics}
          onSave={(neuerText) => {
            setLyrics(neuerText);
            setIstEditorOffen(false);
          }}
          onClose={() => setIstEditorOffen(false)}
        />
      )}
    </section>
  );
}
