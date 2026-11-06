// AAA: Alle Inhalte des Badges. Hier änderst du Name, Texte und das Profilbild.
export const artistBadgeConfig = {
  titel: "THE ARTIST",
  idNummer: "ID#P-23",
  untertitel: "VOCAL COACHING PROFILE",
  // Eigenes Foto: Datei nach public/badge/ legen und hier den Pfad eintragen
  bildSrc: "/badge/profile.svg",
  bildAlt: "Profilbild",
  name: "MOSES",
  beruf: "VOCAL COACH",
  klasse: "ARTIST",
  level: "LV 07 · GOSPEL & POP",
  fusszeile: "HOLDER OF THIS CARD IS A VOCAL COACH",
  easterEgg: "45-12H",
};

export type ArtistBadgeConfig = typeof artistBadgeConfig;
