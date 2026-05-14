# Architektur

Dieses Dokument erklärt in einfachen Worten, wie das bestehende Song Analysis
Tool aufgebaut ist. Ziel ist, dass du (Moses) den Aufbau hier nachlesen und
ohne Blick in den Code jemand anderem erklären kannst.

Die ergänzende Datei [`MODULES.md`](MODULES.md) beschreibt jede einzelne Datei
im Detail. Diese Datei zeigt die Vogelperspektive.

---

## 1. Das große Ganze

Die App ist ein klassisches dreischichtiges Web-Setup:

```
+-----------------------------+        HTTP/JSON         +----------------------------+        Mongoose         +-----------+
|         Frontend            |  <-------------------->  |          Backend           |  <------------------>   |  MongoDB  |
|  React 19 + Vite (Browser)  |   /api/songs (CRUD)      |  Express 5 + TypeScript    |   Dokumente lesen/      |   Atlas   |
|                             |                          |                            |   schreiben             |           |
+-----------------------------+                          +----------------------------+                         +-----------+
```

- Im Browser läuft eine React-Single-Page-App, im Dev-Modus von Vite serviert.
- Der Browser ruft eine kleine REST-API auf dem Express-Server.
- Der Server spricht über Mongoose mit MongoDB.

Zwischen Client und Server gibt es kein gemeinsames Paket; die Kommunikation
läuft ausschließlich über JSON via HTTP.

---

## 2. Anatomie eines einzelnen Requests

Beispiel: „Öffne die Detailseite eines bestehenden Songs."

1. **Routing im Browser.** Der Nutzer klickt einen `<Link to="/songs/abc">` in
   `SongList.tsx`. `react-router-dom` matcht die Route `/songs/:id` in
   `App.tsx` und rendert `SongDetailPage`.
2. **API-Aufruf.** `SongDetailPage` ruft `getSongById(id)` aus
   `client/src/api/songApi.ts` auf, das ein `fetch` auf
   `http://127.0.0.1:5001/api/songs/abc` macht.
3. **Express empfängt den Request.** `app.ts` mountet `songRoutes.ts` unter
   `/api/songs`, das `GET /:id` auf `getSongById` im Controller routet.
4. **Mongoose-Query.** `getSongById` ruft `SongModel.findById(req.params.id)`
   auf und bekommt ein Dokument oder `null` zurück.
5. **JSON-Antwort.** Der Controller serialisiert das Dokument zu JSON und
   antwortet. Wenn nichts gefunden wurde, gibt er `404` zurück.
6. **State-Update in React.** Zurück im Browser legt `SongDetailPage` den Song
   in den State (`setSong(data)`) und rendert neu. Der Nutzer sieht das
   Detail-Layout.

Anlegen, Bearbeiten und Löschen folgen demselben Muster, nur mit anderen
HTTP-Methoden (`POST`, `PUT`, `DELETE`).

---

## 3. Datenfluss in der Listen-/Filteransicht

Die Listenansicht ist die einzige Stelle, an der ein Query-String gebaut
wird.

```
SongFilter (Komponente) ──► filters-Objekt im State von SongListPage
                              │
                              ▼
                    handleSearch() / handleReset()
                              │
                              ▼
                    getSongs(filters) in songApi.ts
                              │       (URLSearchParams)
                              ▼
                  GET /api/songs?progression=...&tempoMin=...
                              │
                              ▼
        Controller getSongs() baut ein Mongo-Filterobjekt
                              │
                              ▼
                  SongModel.find(filter).sort({ createdAt: -1 })
```

Wichtige Eigenschaften:

- Jeder Filter im Controller nutzt ein groß-/kleinschreibungsunabhängiges
  Regex-Match (`{ $regex, $options: "i" }`), außer `tempo`/`tempoMin`/`tempoMax` —
  die werden als Zahlen geparst.
- Leere Strings im Client werden vor dem Request weggefiltert
  (`Object.entries(filters).forEach(...)`).
- Die Liste ist immer absteigend nach `createdAt` sortiert (neueste zuerst).

---

## 4. Das Datenmodell an zwei Stellen

Dieselbe Form taucht zweimal im Projekt auf. Aktuell wird sie von Hand
synchron gehalten:

```
server/src/models/Song.ts          client/src/types/song.ts
─────────────────────────          ───────────────────────────
Mongoose-Schema +                  TypeScript-Typ, von Komponenten
inferierter TS-Typ                 und Pages benutzt
```

Das Mongoose-Schema bringt zusätzlich:

- `_id`: die Mongo-ObjectId (als String im JSON).
- `createdAt`, `updatedAt`: Timestamps durch `{ timestamps: true }`.
- `normalizedProgression`: abgeleiteter Wert, vom Controller über
  `normalizeProgression(progression)` gesetzt.

`normalizeProgression()` macht: lowercase, trim, ersetzt en-/em-Dashes durch
`-`, kollabiert Whitespace zu `-` und mehrfache `-` zu einem. So wird aus
`"I – V — vi  IV"` ein `"i-v-vi-iv"`. Idee: zwei leicht unterschiedlich
geschriebene Progressionen sollen bei der Suche trotzdem als gleich gelten.

---

## 5. Frontend-Aufbau: Pages vs. Components

Pages besitzen State und Daten-Fetching. Components sind „dumme" UI-Stücke.

```
App.tsx (Router)
├── SongListPage       ── State:  songs, filters, isLoading
│   ├── SongFilter      (vom Parent kontrolliert)
│   └── SongList        (rendert Karten, ruft onDeleteSong)
│
├── SongFormPage       ── State:  Navigation, ruft createSong
│   └── SongForm        (controlled inputs, ruft onAddSong)
│
├── SongDetailPage     ── State:  song, isLoading
│
└── SongEditPage       ── State:  song, isLoading, ruft updateSong
    └── SongForm        (wiederverwendet mit initialValues)
```

`SongForm` ist die einzige Quelle der Wahrheit für das Anlegen-/Bearbeiten-
Formular. Sowohl die Anlegen-Seite als auch die Bearbeiten-Seite rendern es;
der einzige Unterschied ist, ob `initialValues` übergeben werden und ob
`onAddSong` letztlich `createSong` oder `updateSong` aufruft.

---

## 6. Backend-Aufbau

Das Backend ist eine schlanke, geschichtete Express-App:

```
server.ts          ── startet den Prozess, lädt .env, ruft connectDB(), app.listen
   │
   ▼
app.ts             ── erstellt die Express-App, registriert cors + json,
                      mountet /api/health und /api/songs
   │
   ▼
routes/songRoutes  ── reines Routing, delegiert an Controller-Funktionen
   │
   ▼
controllers/songController
   │   │  validiert den Request-Body (manuell)
   │   │  ruft Mongoose auf
   │   ▼
   ▼
models/Song        ── Mongoose-Schema und exportiertes `SongModel`
   │
   ▼
config/db          ── einmaliger `mongoose.connect` mit `MONGO_URI`
```

`utils/normalizeProgression` ist eine pure Hilfsfunktion, die der Controller
sowohl in `createSong` als auch in `updateSong` aufruft.

---

## 7. Konfiguration und Umgebung

- `server/.env` ist die einzige `.env`, die der Server tatsächlich lädt.
- `server.ts` ruft `dotenv.config()` auf, **bevor** `app` importiert wird,
  damit alle nachfolgenden Module die richtigen Umgebungsvariablen sehen.
- `process.env.PORT` fällt auf `5000` zurück, wenn nicht gesetzt.
- `process.env.MONGO_URI` ist Pflicht; der Server wirft beim Start, wenn die
  Variable fehlt.

Das Frontend hat aktuell keine `.env`. Die API-Base-URL ist in
`client/src/api/songApi.ts` hartcodiert. Empfohlener nächster Schritt: durch
`import.meta.env.VITE_API_BASE_URL` ersetzen und ein `client/.env.local`
anlegen.

---

## 8. Fehlerbehandlung

Fehler werden pro Controller-Funktion behandelt:

- Validierungsfehler liefern `400` mit `{ message }`.
- Nichts gefunden per ID gibt `404`.
- Alles andere wird `500` und der ursprüngliche Fehler landet im Server-Log
  (`console.error("Fehler beim …:", error)`).

Es gibt keine globale Error-Middleware und kein strukturiertes Logging.

Im Frontend werfen die API-Helfer einen generischen `Error`, wenn
`response.ok` false ist. Pages packen die Fetches meist in `try/finally` und
zeigen keinen Fehler-Toast — Fehler bleiben in der UI also stumm.

---

## 9. Was die Architektur heute NOCH NICHT hat

Diese Lücken werden im Refactor-Plan bewusst angegangen:

- Keine Authentifizierung oder Autorisierung. Die API ist offen.
- Kein umgebungsabhängiger Base-URL.
- Keine gemeinsamen Typen zwischen Client und Server.
- Keine Validierungsbibliothek (z. B. Zod).
- Keine Tests, keine CI.
- Keine Datei-Uploads, keine PDF-Generierung, keine Spotify-Anbindung.
- Keine mehrsprachige Unterstützung über die ad-hoc deutschen Labels hinaus.

Siehe [`REFACTOR_PLAN.md`](REFACTOR_PLAN.md), wie jeder Punkt auf dem Weg zum
AGG Musik Repertoire Tool angegangen wird.
