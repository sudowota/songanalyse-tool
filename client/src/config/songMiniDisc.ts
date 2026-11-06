// AAA: Alle Texte der MiniDisc. Hier änderst du Marke, Untertitel und Labels.
export const miniDiscConfig = {
  marke: "STYLES",
  einlegen: "INSERT THIS END ▲",
  aufdruck: "RECORDABLE MD",
  untertitel: "VOCAL SESSION",
  modell: "MINIDISC 80",
  leer: "—",
  labels: {
    song: "SONG",
    artist: "ARTIST",
    key: "KEY",
    bpm: "BPM",
    status: "STATUS",
    datum: "DATE",
  },
};

// AAA: Verfügbare Farben der MiniDisc. Standard ist Orange.
// Später soll die Farbe aus dem Vibe des Songs kommen (noch nicht umgesetzt).
export const discFarben = {
  orange: "/minidisc/md-orange.png",
  purple: "/minidisc/colors/purple.webp",
  blue: "/minidisc/colors/blue.webp",
  yellow: "/minidisc/colors/yellow.webp",
  lightblue: "/minidisc/colors/lightblue.webp",
  pink: "/minidisc/colors/pink.webp",
  mint: "/minidisc/colors/mint.webp",
  green: "/minidisc/colors/green.webp",
  black: "/minidisc/colors/black.webp",
  clear: "/minidisc/colors/clear.webp",
} as const;

export type DiscFarbe = keyof typeof discFarben;

export const standardFarbe: DiscFarbe = "orange";
