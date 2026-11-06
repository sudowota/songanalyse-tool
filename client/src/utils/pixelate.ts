// AAA: Macht aus einem Foto ein Pixelbild.
// Schritt 1: Quadratisch zuschneiden. Schritt 2: auf wenige Pixel verkleinern.
// Schritt 3: Farben auf wenige Stufen reduzieren.
export function pixelateImage(
  file: File,
  groesse: number,
  stufen: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const bild = new Image();

    bild.onload = () => {
      URL.revokeObjectURL(url);

      const seite = Math.min(bild.width, bild.height);
      const sx = (bild.width - seite) / 2;
      const sy = (bild.height - seite) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = groesse;
      canvas.height = groesse;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas nicht verfügbar."));
        return;
      }

      // Schritt 2: Verkleinern ohne Glättung, damit die Kanten hart bleiben
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(bild, sx, sy, seite, seite, 0, 0, groesse, groesse);

      // Schritt 3: Farben auf wenige Stufen runden
      const bilddaten = ctx.getImageData(0, 0, groesse, groesse);
      const daten = bilddaten.data;
      const schritt = 255 / (stufen - 1);

      for (let i = 0; i < daten.length; i += 4) {
        daten[i] = Math.round(daten[i] / schritt) * schritt;
        daten[i + 1] = Math.round(daten[i + 1] / schritt) * schritt;
        daten[i + 2] = Math.round(daten[i + 2] / schritt) * schritt;
      }

      ctx.putImageData(bilddaten, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    bild.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Bild konnte nicht gelesen werden."));
    };

    bild.src = url;
  });
}
