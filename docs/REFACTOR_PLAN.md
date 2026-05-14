# Refactor-Plan: Song Analysis Tool → AGG Musik Repertoire Tool

Dieses Dokument beschreibt den **sicheren** Weg vom aktuellen Song Analysis
Tool hin zu einem professionellen Chor-Repertoire- und Musikanalyse-Werkzeug
für AGG Musik.

> Wert von AGG Musik: **„Wir singen vertikal."**

Der Plan ist bewusst inkrementell. Wir schreiben die App **nicht neu**. Wir
löschen **keine funktionierenden Features**. Wir ergänzen Felder und Views
in kleinen, überprüfbaren Schritten. Nach jedem Schritt muss die App noch
bauen, starten und Anlegen / Liste / Detail / Bearbeiten / Löschen
unterstützen.

---

## 1. Vision in Kürze

Das neue Produkt soll der zentrale Ort sein, um:

- das gesamte Chor-Repertoire zu speichern,
- Songs nach **Song-Typ** zu klassifizieren,
- Songs musikalisch zu analysieren,
- **Texte, Übersetzungen, Tonarten, Referenzen, Solmisation, Arrangements**
  und **chor-spezifische Notizen** zu verwalten,
- später schön formatierte **gebrandete Liedblätter / Text-Booklets** mit
  Solmisation zu erzeugen,
- irgendwann **Spotify-Playlists** anzubinden,
- deploybar und von verschiedenen Geräten erreichbar zu sein.

### Song-Typen

| Code           | Anzeige              | Charakter (kurz)                                  |
|----------------|----------------------|---------------------------------------------------|
| `CHORAL`       | Choral               | Südafrikanische / kongolesische / afrikanische Chor-Klassiker, a cappella, polyphones Klatschen; „öffnet die Schleusen" |
| `HYMN_ANTHEM`  | Hymnen / Anthems     | Kurze 4–8-zeilige Songs; spontan; brauchen Verzier- und Lead-Skill |
| `DWELLING`     | Dwelling / Worship   | Worship-Dwelling-Songs                            |
| `LOUANGE`      | Louange              | Community-Insiderschatz; nur im richtigen Cross-Context |

### Sänger-Rollen & Stimmlevel

Diese werden **nicht** sofort zu Datenbankfeldern. Sie stehen hier, damit
die UI-Texte und die spätere „Voices / Parts"-UX darauf verweisen können:

- **Chorsänger:** Level 2–3
- **Solo:** Level 4
- **Lead:** Level 4–5

Stimmlevel:

1. hat Stimme, Willen, liebt Jesus,
2. kann mit Unterstützung Töne wiederholen, hat Rhythmusgefühl,
3. stabile und kontrollierte Stimme, kann kraftvoll und leicht singen,
4. kann die Stimme strahlen lassen,
5. singt Läufe flüssig.

---

## 2. Entwicklung des Datenmodells

Das aktuelle `Song`-Schema bleibt das Fundament. Neue Felder kommen in
Wellen dazu. Bestehende Felder behalten ihre Namen, damit vorhandene Daten
gültig bleiben.

### Welle A — Klassifizierung (kleinstmögliche Änderung)

Ein einziges Feld ergänzen. Sonst nichts.

```ts
songType: "CHORAL" | "HYMN_ANTHEM" | "DWELLING" | "LOUANGE";
```

- Wird im `SongModel` gespeichert, zunächst optional (Default `undefined`),
  damit bestehende Dokumente gültig bleiben.
- Wird Pflichtfeld, sobald das Anlege-Formular das Feld setzt.

### Welle B — Tonarten & Referenzen

```ts
key: {
  myKey?: string;
  temiKey?: string;
  choirKey?: string;
  originalKey?: string;
};
referenceLinks: string[];          // freie Links
spotifyLink?: string;
youtubeLink?: string;
```

`referenceLinks` ist der allgemeine Sammeltopf. `spotifyLink` und
`youtubeLink` sind Komfort-Felder, auf die die UI mit Logos verlinken kann.

### Welle C — Texte, Übersetzungen, Solmisation

```ts
lyrics?: string;                   // Originaltext
translations?: {
  german?:    string;
  english?:   string;
  french?:    string;
  portuguese?: string;
  lingala?:   string;
  kikongo?:   string;
  other?:     string;              // Freitext
};
solmization?: string;              // do-re-mi
vocalParts?: {
  soprano?: string;
  alto?:    string;
  tenor?:   string;
  bass?:    string;
  lead?:    string;
  solo?:    string;
};
```

### Welle D — Chor-spezifische Metadaten

Tags werden zu Arrays neben den bestehenden Feldern:

```ts
grooveTags: string[];              // groove (String) → grooveTags (Array)
feelingTags: string[];             // dasselbe für feeling
instrumentTags: string[];          // instruments umbenennen
associationTags: string[];         // associations umbenennen
servicePlacementNotes?: string;
arrangementNotes?: string;
printNotes?: string;
notes?: string;
status: "idea" | "in_progress" | "ready" | "archived";
requiredMaterials: {
  lyrics: boolean;
  solmization: boolean;
  translationGerman: boolean;
  translationOther: boolean;
  referenceTrack: boolean;
  printVersion: boolean;
};
```

> **Umbenennungs-Policy.** Die einfachen String-Felder `groove` und
> `feeling` bleiben so lange, bis Welle D ausgerollt ist. Dann fügen wir
> die Array-Versionen hinzu, schreiben für ein Release in beide Felder
> parallel und entfernen die alten erst, wenn Formular und Detailseite
> sie nicht mehr referenzieren. So gibt es keinen Datenverlust.

### Mapping alte Felder ↔ neue Felder

| Alt (aktuelles Schema)      | Neu                                       |
|-----------------------------|-------------------------------------------|
| `title`                     | unverändert                               |
| `artist`                    | unverändert (deckt zugleich Origin/Tradition ab) |
| `tempo`                     | unverändert (UI nennt es `bpm`)           |
| `progression`               | unverändert                               |
| `normalizedProgression`     | unverändert (weiterhin abgeleitet)        |
| `groove`                    | ersetzt durch `grooveTags[]` (Welle D)    |
| `instruments`               | umbenannt zu `instrumentTags[]`           |
| `feeling`                   | ersetzt durch `feelingTags[]`             |
| `associations`              | umbenannt zu `associationTags[]`          |
| `analysisStatus`            | ersetzt durch `status`                    |

Die Migration ist rückwärtskompatibel: bis Welle D laufen die bestehenden
Felder unverändert weiter.

---

## 3. UI-Entwicklung

Die aktuelle UI hat vier Seiten: Liste, Anlegen, Detail, Bearbeiten. Die
bleiben. Neue Seiten kommen daneben dazu.

### Seiten nach dem Refactor

1. **Dashboard** — Überblick über das Repertoire.
   - Anzahl Songs pro Song-Typ,
   - Songs mit fehlenden Pflichtmaterialien,
   - kürzlich hinzugefügte Songs.
2. **Repertoire-Liste** — die heutige Listenansicht, mit neuen Filtern:
   - songType, Progression, BPM-Bereich, Tonart, Tags, Status, Sprache,
     fehlende Materialien.
3. **Song-Detailansicht** — die heutige Detailansicht, erweitert:
   - Metadaten, musikalische DNA, Texte, Übersetzungen, Solmisation,
     Referenzlinks, Arrangement-Notizen, Checkliste der Pflichtmaterialien.
4. **Song-Anlegen-/Bearbeiten-Ansicht** — das heutige Formular, in
   Abschnitte gegliedert:
   - Basics, Musikalisches, Chor / Service, Texte & Übersetzungen,
     Solmisation & Arrangement, Referenzen, Notizen.
5. **Song-Typ-Übersicht** — eine Route pro Song-Typ. Jede zeigt die
   Charakter-Beschreibung, Service-Einsatz, Pflichtmaterialien und eine
   Liste verwandter Songs.

### Visuelle Auffrischung

- Navigation branden: „AGG Musik – Repertoire".
- Die bestehende Karten-Ästhetik behalten (abgerundete Karten, sanfte
  Schatten). Das sieht schon gut aus.
- Auf jeder Songkarte einen kleinen Song-Typ-Chip einblenden:
  `CHORAL`, `HYMN`, `DWELLING`, `LOUANGE`.

---

## 4. Reihenfolge der Umsetzung (genau diese, in dieser Reihenfolge)

Jeder Schritt ist klein und reviewbar. Nach jedem Schritt muss die App
end-to-end laufen.

> Schritt 0 ist Aufräumarbeit — unspektakulär, aber wertvoll.

### Schritt 0 — Aufräumen

- Ports angleichen: `PORT=5001` in `server/.env` setzen (oder den Client
  umstellen). Dokumentieren, was gewählt wurde.
- Hartcodierte API-URL in `client/src/api/songApi.ts` durch
  `import.meta.env.VITE_API_BASE_URL` ersetzen, mit sinnvollem Default.
- Doppelten Routen-Block in `server/src/routes/songRoutes.ts` entfernen.
- `src_backup/` nach `archive/` verschieben (oder ganz aus dem Repo
  rausnehmen).

### Schritt 1 — `songType` end-to-end (Welle A)

1. Feld in `server/src/models/Song.ts` ergänzen. Optional halten.
2. Feld in `client/src/types/song.ts` und in `CreateSongData` in
   `songApi.ts` ergänzen.
3. `<select>` in `SongForm.tsx` hinzufügen.
4. Song-Typ-Chip in `SongList.tsx` und auf `SongDetailPage.tsx` anzeigen.
5. `songType`-Filter in `SongFilter.tsx` und im `getSongs`-Filterobjekt
   des Controllers ergänzen.

Nach diesem Schritt kannst du bestehende Songs schon klassifizieren.

### Schritt 2 — Song-Typ-Übersichtsseiten

Neue Route `/types/:type`, die Charakter-, Service-Einsatz- und
Pflichtmaterialien-Texte rendert plus eine nach diesem Typ gefilterte
Liste. Nutzt `SongList` und die bestehende API wieder.

### Schritt 3 — Tonarten, Referenzen, Links (Welle B)

`key.*`, `referenceLinks[]`, `spotifyLink`, `youtubeLink` ergänzen. In der
Detailansicht zeigen. Im Formular unter „References" und „Musikalisches"
gruppieren.

### Schritt 4 — Texte, Übersetzungen, Solmisation (Welle C)

`lyrics`, `translations.*`, `solmization`, `vocalParts.*` ergänzen. In der
Detailansicht als ein-/ausklappbare Sektionen rendern (damit die Seite
auch lesbar bleibt, wenn die meisten Felder leer sind).

### Schritt 5 — Chor-Metadaten (Welle D)

Tag-Arrays, Status-Enum, Pflichtmaterialien-Checkliste und Notizen
einführen. Die alten String-Felder `groove` und `feeling` erst dann
ablösen, wenn die neuen Tag-Inputs produktiv sind.

### Schritt 6 — Dashboard

Das Dashboard aus den bestehenden Endpunkten bauen; leichte Aggregation
im Controller (`/api/songs/stats`) erst dann ergänzen, wenn die
Client-Implementierung sie braucht.

### Schritt 7 — Booklet / Liedblatt-PDF

Out of scope, bis alles oben stabil läuft. Wenn es so weit ist, soll es
auf demselben Datenmodell aufsetzen, nicht auf einem parallelen.

### Schritt 8 — Spotify-Integration

Out of scope, bis Schritt 7 ausgerollt ist.

---

## 5. Wie wir den Refactor sicher halten

Eine Handvoll Regeln, die die laufende App schützen:

- **Nie ein Feld löschen** ohne vorher eine Migration zu schreiben, die
  die Daten in das neue Feld kopiert.
- **Erst hinzufügen, dann entfernen.** Wird ein Feld ersetzt, leben neue
  und alte Version mindestens ein Release lang nebeneinander.
- **Nie den API-Vertrag brechen.** Neue Felder hinzufügen, alte bestehen
  lassen, bis beide Seiten umgezogen sind.
- **`npm run dev` muss in `client/` und `server/` nach jedem Commit
  laufen.**
- **Eine Sache pro Änderung.** Kein „Umbenennen + Feld hinzufügen +
  Styling-Refresh" in einem PR.
- Nach jeder Änderung eine kurze Notiz hier oder im CHANGELOG schreiben:
  was sich verschoben hat, warum, wie man es testet.

---

## 6. Dokumentations-Disziplin

Wenn ein Modul ergänzt oder geändert wird:

- bei nicht-offensichtlicher Verantwortung einen kurzen Kommentar an den
  Dateianfang setzen,
- [`MODULES.md`](MODULES.md) aktualisieren, damit die Datei-Übersicht
  stimmt,
- wenn sich Architektur (Datenfluss, Request-Lebenszyklus, Env-Konfig)
  ändert, [`ARCHITECTURE.md`](ARCHITECTURE.md) anpassen,
- in einer Sprache schreiben, die auch ein Anfänger versteht.
  Zukunfts-Moses soll es ohne Blick in den Diff verstehen.

---

## 7. Glossar (AGG-spezifische Begriffe)

- **Choral.** Südafrikanische / kongolesische / breitere afrikanische
  Chor-Klassiker, oft übersetzt, gedacht, um vor der Predigt, nach der
  Kollekte oder rund um Trailer-Video-Momente „die Schleusen zu öffnen".
  Der Lead kann in der Muttersprache starten, während die deutsche
  Übersetzung eingeblendet wird.
- **Hymn / Anthem.** 4–8-zeiliges, kurzes Lied, das die spirituelle
  Erinnerung auffrischt; aus dem globalen Kirchen-Repertoire (USA,
  Nigeria, Deutschland). Spontan während Worship oder Predigt. Pianist /
  Band muss folgen können.
- **Dwelling / Worship.** Längere, kontemplative Worship-Songs.
- **Louange.** Ein Community-Insiderschatz, primär für den internen
  Gebrauch; nur in passendem Cross-Context auch nach außen.
- **Solmisation.** Singen mit `do, re, mi, fa, sol, la, ti` (oder
  Curwen-Stil `d-r-m-f-s-l-t`). Wird im Chor genutzt, um Stimmen ohne
  Noten zu vermitteln.
- **Polyphones Klatschen.** Mehrere Klatsch-Patterns unter dem Lied,
  typisch im afrikanischen Chor-Kontext.

---

## 8. Offene Fragen für später

Diese blockieren Schritt 1 nicht. Hier geparkt:

- Sänger-Profile: Welche Sprachen sprichst du? Singst du Songs, die du
  kennst, mit Selbstvertrauen 1–5? Schreibst du Texte? — vermutlich
  später eine eigene `Member`-Collection.
- Suche pro Sprache: Wollen wir nach „hat deutsche Übersetzung" filtern?
- Datei-Anhänge (Liedblatt-PDF, Audio-Referenz) — Storage und Lifecycle.
- Authentifizierung — die API ist aktuell offen.
- Multi-Tenant oder Single-Choir? Heute ist die App implizit
  Single-Choir.

Sobald einer dieser Punkte echte Arbeit blockiert, wird er zu einem
nummerierten Umsetzungsschritt hochgezogen.
