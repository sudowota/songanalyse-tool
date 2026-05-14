# Module

Eine Tour Datei für Datei durch den aktuellen Code. Ziel ist, dass du zu
jeder Datei folgende Fragen beantworten kannst:

- Wofür ist diese Datei zuständig?
- Wovon hängt sie ab?
- Wo müsste ich für ein kleines Feature ansetzen?

Die Reihenfolge ist nach Schichten gruppiert und folgt dem Weg eines Requests
durch die App.

---

## Backend

### `server/src/server.ts`

Startet den Prozess. Drei Dinge passieren hier:

1. `dotenv.config()` läuft **bevor** `app` importiert wird, damit
   `process.env.*` in `app.ts` und `db.ts` schon korrekt befüllt ist.
2. `connectDB()` wird abgewartet; ist Mongo nicht erreichbar, beendet sich der
   Prozess mit Exit-Code 1.
3. `app.listen(port, ...)` startet den HTTP-Server. `port` ist
   `process.env.PORT || 5000`.

Verantwortung: Lifecycle und Bootstrapping des Prozesses.

### `server/src/app.ts`

Erstellt die Express-App. Registriert zwei Middlewares (`cors()` und
`express.json()`) und mountet:

- `GET /api/health` — gibt `{ message: "Server läuft." }` zurück. Wird als
  Liveness-Check benutzt.
- `/api/songs` — delegiert an `songRoutes`.

Verantwortung: HTTP-Verdrahtung. Keine Geschäftslogik.

### `server/src/config/db.ts`

Eine einzige async-Funktion `connectDB()`, die
`mongoose.connect(process.env.MONGO_URI)` aufruft. Wirft, wenn `MONGO_URI`
fehlt. Loggt bei Erfolg `"MongoDB verbunden."`.

Verantwortung: die Datenbankverbindung. Wird beim Start einmal aufgerufen.

### `server/src/models/Song.ts`

Definiert das Mongoose-Schema für Songs:

| Feld                    | Typ      | Default      | Hinweise                                   |
|-------------------------|----------|--------------|--------------------------------------------|
| `title`                 | String   | Pflicht      | getrimmt                                   |
| `artist`                | String   | `""`         | getrimmt                                   |
| `tempo`                 | Number   | —            | `min: 0`, optional                         |
| `progression`           | String   | `""`         | getrimmt                                   |
| `normalizedProgression` | String   | `""`         | wird vom Controller geschrieben            |
| `groove`                | String   | `""`         | getrimmt                                   |
| `instruments`           | [String] | `[]`         |                                            |
| `feeling`               | String   | `""`         | getrimmt                                   |
| `associations`          | [String] | `[]`         |                                            |
| `analysisStatus`        | String   | `"offen"`    | enum: `"offen"` \| `"analysiert"`          |

Aktiviert außerdem `timestamps: true`, sodass jedes Dokument `createdAt` und
`updatedAt` bekommt. Exportiert `SongModel` (das Model) und `Song` (den
inferierten TypeScript-Typ via `InferSchemaType`).

Verantwortung: die persistierte Form eines Songs. **Hier werden neue Felder
hinzugefügt**, wenn das Modell wächst.

### `server/src/utils/normalizeProgression.ts`

Pure Hilfsfunktion. Nimmt einen String wie `"I – V — vi  IV"` und gibt
`"i-v-vi-iv"` zurück:

1. lowercase
2. trim
3. en-/em-Dashes durch `-` ersetzen
4. jede Whitespace-Folge zu `-` machen
5. mehrfache `-` zu einem zusammenziehen

Wird vom Controller in `createSong` und `updateSong` benutzt, um
`normalizedProgression` zu setzen, damit zwei leicht unterschiedlich
geschriebene Progressionen bei der Suche trotzdem matchen.

### `server/src/controllers/songController.ts`

Fünf exportierte Handler:

- `createSong` — validiert `title`, normalisiert `progression`, schreibt
  über Mongoose, antwortet `201`.
- `getSongs` — liest Query-Parameter, baut ein Mongo-`filter`-Objekt; nutzt
  groß-/kleinschreibungsunabhängige Regex-Matches für Strings und Zahlen-
  vergleiche für tempo/`tempoMin`/`tempoMax`. Liefert sortierte Ergebnisse
  (neueste zuerst).
- `getSongById` — `findById`, `404` wenn nicht gefunden.
- `updateSong` — überschreibt jedes Feld des Dokuments
  (`findByIdAndUpdate` mit `runValidators: true`). **Achtung:** Fehlende
  Felder werden zu leeren Strings/Arrays, das PUT muss also immer den
  vollständigen Payload mitschicken.
- `deleteSong` — `findByIdAndDelete`, `404` wenn nicht gefunden.

Verantwortung: Request-Validierung (manuell) und Orchestrierung der
Model-Aufrufe.

### `server/src/routes/songRoutes.ts`

Verbindet HTTP-Methoden und Pfade mit den Controller-Funktionen. Registriert
aktuell jede Route **zweimal** (Zeilen 12–16 und nochmal 18–22). Express
nimmt den ersten passenden Handler, also harmlos — aber im nächsten Refactor
sollte das aufgeräumt werden.

Verantwortung: URL → Handler-Mapping.

### `server/.env`

Enthält `PORT` und `MONGO_URI`. Wird in `server.ts` durch `dotenv.config()`
geladen. Sollte nie mit echten Credentials in ein öffentliches Repo
gelangen.

---

## Frontend

### `client/index.html`

Vites Einstiegs-HTML. Mountet ein einzelnes `<div id="root">` und lädt
`/src/main.tsx` als Modul.

### `client/src/main.tsx`

React-Einstieg. Wickelt `<App />` in `<React.StrictMode>` und
`<BrowserRouter>` und rendert in `#root`.

### `client/src/App.tsx`

Top-Level-Layout + Router. Rendert eine `<nav>` mit zwei Links und vier
`<Route>`-Definitionen:

| Pfad                | Element            |
|---------------------|--------------------|
| `/`                 | `SongListPage`     |
| `/new`              | `SongFormPage`     |
| `/songs/:id`        | `SongDetailPage`   |
| `/songs/:id/edit`   | `SongEditPage`     |

Verantwortung: Navigation. Kein eigener State.

### `client/src/index.css`

Globale App-Styles. Definiert den Seiten-Container, das Karten-Look der
Formulare und Songkarten, das Form-Grid, die Buttons, den Song-Detail-Hero
und den BPM-Badge. Auch die `.danger-button`- und `.tag`-Styles leben hier.

### `client/src/App.css`

Größtenteils Reste aus dem Vite-React-Template (Hero-/Icon-/Scaffolding-
Styles). Aktiv genutzt werden in der UI nur `.button-link` und
`.danger-button` unten in der Datei. Kann später ausgemistet werden.

### `client/src/types/song.ts`

Die TypeScript-Form eines Songs aus Sicht der UI. Spiegelt das
Mongoose-Schema plus `_id`, `createdAt`, `updatedAt`. Aktuell wird das von
Hand gepflegt — Schemaänderung am Server bedeutet auch Änderung hier.

### `client/src/api/songApi.ts`

Zentrale Fetch-Schicht. Exportiert:

- `API_BASE_URL` (Konstante, aktuell `http://127.0.0.1:5001/api/songs`).
- `CreateSongData` — Payload-Form für POST/PUT.
- `SongFilters` — Query-String-Form für die Listenansicht.
- `getSongs(filters)` — baut `URLSearchParams`, holt die Liste.
- `getSongById(id)` — einzelner Fetch.
- `createSong(data)` — POST.
- `updateSong(id, data)` — PUT.
- `deleteSong(id)` — DELETE.

Jeder Helfer wirft einen generischen `Error` mit deutscher Meldung, wenn die
Antwort nicht OK ist. **Hier** wird in einem späteren Refactor ein
env-getriebener Base-URL oder ein Auth-Header eingebaut.

### `client/src/components/SongForm.tsx`

Kontrolliertes Formular zum Anlegen oder Bearbeiten eines Songs. Interner
State deckt alle acht Felder ab (`title`, `artist`, `tempo`, `progression`,
`groove`, `instruments`, `feeling`, `associations`). `tempo` wird im State
als String gehalten und erst beim Submit zur Zahl konvertiert. Instrumente
und Assoziationen werden als komma-getrennter String eingegeben und beim
Submit in ein Array gesplittet.

Props:

- `onAddSong(data)` — aufgerufen nach `event.preventDefault()`.
- `initialValues` — optional, von der Edit-Seite gesetzt.
- `submitLabel` — Default `"Song speichern"`; die Edit-Seite überschreibt es
  mit `"Änderungen speichern"`.

`isSubmitting` deaktiviert den Submit-Button, solange der Request läuft.

### `client/src/components/SongFilter.tsx`

Reine UI für die Filterkarte. Rendert dasselbe Form-Grid-Layout wie
`SongForm` und informiert den Parent über `onChange`, `onSearch` und
`onReset`. Vollständig kontrolliert — kein eigener State. Das `filters`-
Objekt liegt im Parent (`SongListPage`), der auch entscheidet, wann
nachgeladen wird.

### `client/src/components/SongList.tsx`

Rendert die Liste der Songkarten. Pro Song werden Tempo, Progression,
Groove, Feeling sowie ein „Details"-Link zur Detailseite und ein
„Löschen"-Button angezeigt. Beim Klick auf Löschen wird
`onDeleteSong(song._id)` aufgerufen. Leerer Zustand: „Keine Songs
gefunden."

### `client/src/pages/SongListPage.tsx`

Die Listenansicht. Hält drei State-Stücke: `songs`, `filters`,
`isLoading`. Beim Mount wird `loadSongs()` ohne Filter aufgerufen. Drei
Handler verbinden Filter und Liste:

- `handleSearch()` — lädt mit aktuellen Filtern neu.
- `handleReset()` — leert Filter und lädt neu.
- `handleDeleteSong(id)` — bestätigt per `window.confirm`, löscht über die
  API und entfernt den Song optimistisch aus dem lokalen State.

### `client/src/pages/SongFormPage.tsx`

Die Anlege-Ansicht. Rendert `SongForm`. Beim Submit wird `createSong`
aufgerufen, danach geht es zurück nach `/`.

### `client/src/pages/SongDetailPage.tsx`

Die Detailansicht. Liest `:id` aus der Route, lädt den Song und rendert den
Hero-Header (Titel, Artist, BPM-Badge), das „Musikalische DNA"-Grid
(Progression, Groove, Feeling, Status) und zwei Tag-Reihen (Instrumente,
Assoziationen). Bietet einen „Bearbeiten"-Link zur Edit-Seite und einen
„Zurück zur Liste"-Link.

### `client/src/pages/SongEditPage.tsx`

Die Bearbeiten-Ansicht. Lädt den Song per ID und rendert `SongForm` mit den
geladenen Werten als Initialwerte. Beim Submit wird `updateSong` aufgerufen
und zur Detailansicht desselben Songs navigiert.

---

## Konfigurationsdateien

### `client/vite.config.ts`

Minimale Vite-Konfiguration, die `@vitejs/plugin-react` registriert.
Defaults reichen für die Entwicklung. Kein Proxy konfiguriert — deshalb
spricht das Frontend das Backend aktuell direkt über eine absolute URL an.

### `client/tsconfig.json` / `client/tsconfig.app.json` / `client/tsconfig.node.json`

Standard-Vite-TypeScript-Setup. `tsconfig.json` ist eine Project-References-
Datei, die auf die App- und Node-Configs zeigt.

### `client/eslint.config.js`

Flat-Config-ESLint, das `js.configs.recommended`,
`tseslint.configs.recommended`, `react-hooks` und `react-refresh`
erweitert. Der `dist`-Ordner wird ignoriert.

### `server/tsconfig.json`

Kompiliert `src/**/*.ts` nach `dist/`. Target ES2020, CommonJS, strict
aktiviert, `esModuleInterop` aktiviert.

### `server/package.json`

Drei Scripts:

- `dev` — `ts-node-dev` mit `--respawn --transpile-only`.
- `build` — `tsc -p tsconfig.json`.
- `start` — `node dist/server.js` (nach `build`).

### `songanalyse.code-workspace`

Ein VS-Code-Workspace mit mehreren Wurzeln, der auf `client` und `server`
zeigt. Praktisch, damit jede Seite ihren eigenen TypeScript-Kontext hat.

---

## Was im Repo NICHT zur Laufzeit benutzt wird

- `src_backup/` — Vorgängerversion vor der Aufteilung. Nirgends
  referenziert. Kann gelöscht oder ausgegliedert werden, sobald der Refactor
  startet.
- `client/src/App.css` — der Großteil ist Vite-Template-Reste. Aktiv genutzt
  werden nur `.button-link` und `.danger-button`.
- Die doppelten Routen-Registrierungen am Ende von
  `server/src/routes/songRoutes.ts`.

Wann was davon aufgeräumt wird, beschreibt `REFACTOR_PLAN.md`.
