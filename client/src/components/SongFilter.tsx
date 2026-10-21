import type { SongFilters } from "../api/songApi";

type SongFilterProps = {
  filters: SongFilters;
  onChange: (filters: SongFilters) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function SongFilter({
  filters,
  onChange,
  onSearch,
  onReset,
}: SongFilterProps) {
  function updateFilter(key: keyof SongFilters, value: string) {
    onChange({
      ...filters,
      [key]: value,
    });
  }

  return (
    <section className="window-outer filter-card">
      <h2>Songs suchen</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Progression</label>
          <input
            value={filters.progression ?? ""}
            onChange={(e) => updateFilter("progression", e.target.value)}
            placeholder="z.B. I-V-vi-IV"
          />
        </div>

        <div className="form-group">
          <label>Feeling</label>
          <input
            value={filters.feeling ?? ""}
            onChange={(e) => updateFilter("feeling", e.target.value)}
            placeholder="z.B. melancholisch"
          />
        </div>

        <div className="form-group">
          <label>Groove</label>
          <input
            value={filters.groove ?? ""}
            onChange={(e) => updateFilter("groove", e.target.value)}
            placeholder="z.B. laid back"
          />
        </div>

<div className="form-group">
  <label>BPM von</label>
  <input
    type="number"
    value={filters.tempoMin ?? ""}
    onChange={(e) => updateFilter("tempoMin", e.target.value)}
    placeholder="z.B. 90"
  />
</div>

<div className="form-group">
  <label>BPM bis</label>
  <input
    type="number"
    value={filters.tempoMax ?? ""}
    onChange={(e) => updateFilter("tempoMax", e.target.value)}
    placeholder="z.B. 120"
  />
</div>

        <div className="form-group">
          <label>Instrument</label>
          <input
            value={filters.instrument ?? ""}
            onChange={(e) => updateFilter("instrument", e.target.value)}
            placeholder="z.B. piano"
          />
        </div>

        <div className="form-group">
          <label>Assoziation</label>
          <input
            value={filters.association ?? ""}
            onChange={(e) => updateFilter("association", e.target.value)}
            placeholder="z.B. Nachtfahrt"
          />
        </div>
      </div>

      <div className="button-row">
        <button type="button" onClick={onSearch}>
          Suchen
        </button>

        <button type="button" className="secondary-button" onClick={onReset}>
          Zurücksetzen
        </button>
      </div>
    </section>
  );
}