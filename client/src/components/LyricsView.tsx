type LyricsViewProps = {
  text: string;
};

// AAA: Zeigt den Songtext formatiert an.
// Zeilen in eckigen Klammern wie [Verse] werden als Abschnittstitel dargestellt.
// Leerzeilen werden als Abstand zwischen den Abschnitten angezeigt.
export default function LyricsView({ text }: LyricsViewProps) {
  // Schritt 1: Gibt es überhaupt Text?
  if (!text || text.trim() === "") {
    return <p>keine lyrics gespeichert.</p>;
  }

  const zeilen = text.split("\n");

  return (
    <div className="lyrics-view">
      {zeilen.map((zeile, index) => {
        const getrimmt = zeile.trim();

        // Schritt 2: Abschnittstitel in eckigen Klammern
        if (getrimmt.startsWith("[") && getrimmt.endsWith("]")) {
          return (
            <p key={index} className="lyric-marker">
              {getrimmt}
            </p>
          );
        }

        // Schritt 3: Leerzeile wird zu Abstand
        if (getrimmt === "") {
          return <div key={index} className="lyric-gap" />;
        }

        // Schritt 4: normale Textzeile
        return (
          <p key={index} className="lyric-line">
            {zeile}
          </p>
        );
      })}
    </div>
  );
}
