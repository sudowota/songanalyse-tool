import { useState } from "react";
import type { CreateSongData } from "../api/songApi";

type SongFormProps = {
  onAddSong: (data: CreateSongData) => Promise<void>;
  initialValues?: Partial<CreateSongData>;
  submitLabel?: string;
};

export default function SongForm({
  onAddSong,
  initialValues,
  submitLabel = "Song speichern",
}: SongFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [artist, setArtist] = useState(initialValues?.artist ?? "");
  const [tempo, setTempo] = useState(
    initialValues?.tempo ? String(initialValues.tempo) : ""
  );
  const [progression, setProgression] = useState(
    initialValues?.progression ?? ""
  );
  const [groove, setGroove] = useState(initialValues?.groove ?? "");
  const [instruments, setInstruments] = useState(
    initialValues?.instruments?.join(", ") ?? ""
  );
  const [feeling, setFeeling] = useState(initialValues?.feeling ?? "");
  const [magicMoment, setMagicMoment] = useState(initialValues?.magicMoment ?? "");
  const [associations, setAssociations] = useState(
    initialValues?.associations?.join(", ") ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      associations: associations
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      setIsSubmitting(true);
      await onAddSong(formData);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Song analysieren</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Songtitel</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Artist</label>
          <input value={artist} onChange={(e) => setArtist(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Tempo</label>
          <input
            type="number"
            value={tempo}
            onChange={(e) => setTempo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Progression</label>
          <input
            value={progression}
            onChange={(e) => setProgression(e.target.value)}
            placeholder="z.B. I-V-vi-IV"
          />
        </div>

        <div className="form-group">
          <label>Groove</label>
          <input value={groove} onChange={(e) => setGroove(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Instruments</label>
          <input
            value={instruments}
            onChange={(e) => setInstruments(e.target.value)}
            placeholder="piano, bass, drums"
          />
        </div>

        <div className="form-group">
          <label>Feeling</label>
          <input value={feeling} onChange={(e) => setFeeling(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Assoziationen</label>
          <input
            value={associations}
            onChange={(e) => setAssociations(e.target.value)}
            placeholder="Nachtfahrt, Sommer, Wehmut"
          />
        </div>
        <div className="form-group form-group-wide">
          <label>Magic Moment</label>
          <textarea
            value={magicMoment}
            onChange={(e) => setMagicMoment(e.target.value)}
            rows={4}
            placeholder="Was gefällt mir besonders? Wo sind die Magic Moments im Song?"
          />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Speichert..." : submitLabel}
      </button>
    </form>
  );
}