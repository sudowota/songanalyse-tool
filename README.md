# Song Analysis Tool

Eine kleine Full-Stack-Webanwendung in TypeScript zur Analyse und Katalogisierung
von Songs. Sie ist der **Ausgangspunkt** für das **AGG Musik Repertoire Tool**
(ein Chor-Repertoire- und Musikanalyse-Werkzeug für AGG Musik).

> Wert von AGG Musik: **„Wir singen vertikal."**

Diese README dokumentiert das Projekt **im aktuellen Zustand**. Der
geplante Refactor in Richtung AGG Repertoire Tool ist separat in
[`docs/REFACTOR_PLAN.md`](docs/REFACTOR_PLAN.md) beschrieben.

---

## 1. Was die App aktuell tut

Die App speichert Songs in einer Datenbank und erlaubt es, sie musikalisch zu
beschreiben. Pro Song kannst du Folgendes erfassen:

- Titel und Artist
- Tempo (BPM)
- Akkordprogression und ihre normalisierte Form
- ein Groove-Tag und ein Feeling-Tag
- eine Liste an Instrumenten
- eine Liste an Assoziationen (freie Tags)
- einen Analyse-Status (`offen` / `analysiert`)

Möglich sind:

- neuen Song anlegen (`/new`)
- alle Songs als Liste ansehen (`/`)
- die Liste nach Progression, Feeling, Groove, BPM-Bereich, Instrument und
  Assoziation durchsuchen und filtern
- Detailseite eines einzelnen Songs öffnen (`/songs/:id`)
- Song bearbeiten (`/songs/:id/edit`)
- Song aus der Liste löschen

Die Oberfläche ist zweigeteilt: oben/links eine Such- und Filterkarte, darunter
eine Liste der Songkarten. Die Detailseite zeigt einen Hero-Header mit BPM-Badge,
ein „Musikalische DNA"-Raster und Tag-Reihen für Instrumente und Assoziationen.

---

## 2. Aktueller Tech-Stack

| Schicht         | Technologie                                        |
|-----------------|----------------------------------------------------|
| Frontend        | React 19, TypeScript, Vite, react-router-dom       |
| Backend         | Express 5, TypeScript, ts-node-dev                 |
| Datenbank       | MongoDB über Mongoose                              |
| Styling         | Reines CSS (`index.css`, `App.css`)                |
| Entwicklertools | ESLint (typescript-eslint, react-hooks-Plugin)     |

Es gibt kein gemeinsames Package zwischen Client und Server; der Song-Typ ist
auf beiden Seiten unabhängig deklariert.

---

## 3. Ordnerstruktur

```
songanalyse-tool/
├── README.md                  ← du bist hier
├── docs/
│   ├── ARCHITECTURE.md        ← Architektur & Datenfluss aus der Vogelperspektive
│   ├── MODULES.md             ← Verantwortlichkeiten pro Datei
│   └── REFACTOR_PLAN.md       ← Weg zum AGG Musik Repertoire Tool
├── songanalyse.code-workspace ← VS-Code-Workspace mit mehreren Wurzeln
├── .env                       ← env auf Wurzelebene (Altlast)
├── client/                    ← Vite + React Frontend
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig*.json
│   ├── eslint.config.js
│   ├── public/                ← statische Assets (favicon, icons.svg)
│   └── src/
│       ├── main.tsx           ← React-Einstieg, mounted <App/>
│       ├── App.tsx            ← Top-Level-Router
│       ├── index.css          ← globale Styles
│       ├── App.css            ← Vite-Template-Reste
│       ├── api/songApi.ts     ← fetch()-Aufrufe ans Backend
│       ├── types/song.ts      ← Song-Typ für die UI
│       ├── components/
│       │   ├── SongForm.tsx   ← Anlegen-/Bearbeiten-Formular (controlled inputs)
│       │   ├── SongFilter.tsx ← Such-/Filterformular
│       │   └── SongList.tsx   ← Liste der Songkarten
│       └── pages/
│           ├── SongListPage.tsx
│           ├── SongFormPage.tsx
│           ├── SongDetailPage.tsx
│           └── SongEditPage.tsx
├── server/                    ← Express + Mongoose Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env                   ← PORT, MONGO_URI
│   └── src/
│       ├── server.ts          ← startet den HTTP-Server
│       ├── app.ts             ← Express-App + Routen-Verdrahtung
│       ├── config/db.ts       ← MongoDB-Verbindung
│       ├── models/Song.ts     ← Mongoose-Schema + Song-Typ
│       ├── controllers/songController.ts ← Request-Handler
│       ├── routes/songRoutes.ts          ← `/api/songs/...`
│       └── utils/normalizeProgression.ts ← Progression-Normalisierung
└── src_backup/                ← alte Version vor der Aufteilung (eingefroren)
```

Der Ordner `src_backup/` ist ein Schnappschuss aus der Zeit, bevor das Projekt in
`client/` und `server/` aufgeteilt wurde. Er wird **von der laufenden App nicht
benutzt** und kann ignoriert bzw. später entfernt werden.

---

## 4. Aktuelle API-Endpunkte

Alle Endpunkte hängen unter `/api/songs` und sprechen JSON. Sie sind in
`server/src/routes/songRoutes.ts` definiert und in
`server/src/controllers/songController.ts` implementiert.

| Methode | Pfad              | Zweck                                  |
|---------|-------------------|----------------------------------------|
| GET     | `/api/health`     | Liveness-Check (gibt eine Meldung zurück) |
| GET     | `/api/songs`      | Songs auflisten (mit Query-Filtern)    |
| GET     | `/api/songs/:id`  | Einen Song per ID holen                |
| POST    | `/api/songs`      | Neuen Song anlegen                     |
| PUT     | `/api/songs/:id`  | Bestehenden Song aktualisieren         |
| DELETE  | `/api/songs/:id`  | Song löschen                           |

Unterstützte Query-Parameter auf `GET /api/songs`:

`progression`, `feeling`, `groove`, `tempo`, `tempoMin`, `tempoMax`,
`instrument`, `association`. Alle sind groß-/kleinschreibungsunabhängige
Substring-Filter, außer den drei Tempo-Parametern — diese werden als
Zahlenvergleiche behandelt.

---

## 5. Aktuelles Datenmodell

Das Mongoose-Schema in `server/src/models/Song.ts` definiert:

| Feld                    | Typ      | Hinweise                                  |
|-------------------------|----------|-------------------------------------------|
| `title`                 | String   | Pflicht, getrimmt                         |
| `artist`                | String   | Default `""`                              |
| `tempo`                 | Number   | optional, min 0                           |
| `progression`           | String   | Default `""`                              |
| `normalizedProgression` | String   | beim Speichern/Update automatisch gesetzt |
| `groove`                | String   | Default `""`                              |
| `instruments`           | String[] | Default `[]`                              |
| `feeling`               | String   | Default `""`                              |
| `associations`          | String[] | Default `[]`                              |
| `analysisStatus`        | enum     | `"offen"` oder `"analysiert"`, Default `"offen"` |
| `createdAt`/`updatedAt` | Date     | automatisch durch `timestamps`            |

Der Frontend-Typ `Song` in `client/src/types/song.ts` spiegelt diese Form.

---

## 6. Backend und Frontend lokal starten

### Voraussetzungen

- Node.js 20+ empfohlen
- Eine laufende MongoDB (Atlas-Cluster oder lokales `mongod`)

### Backend

```bash
cd server
npm install
# server/.env muss MONGO_URI=... enthalten und (optional) PORT=...
npm run dev
```

`npm run dev` führt `src/server.ts` direkt über `ts-node-dev` aus. Der Server
liest `MONGO_URI` aus `server/.env`, verbindet sich mit MongoDB und startet einen
Express-HTTP-Server auf `process.env.PORT || 5000`.

Ein erfolgreicher Start gibt aus:

```
MongoDB verbunden.
Server läuft auf Port 5000
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Das startet den Dev-Server von Vite (standardmäßig `http://127.0.0.1:5173`). Das
Frontend holt sich Daten direkt von `http://127.0.0.1:5001/api/songs` (siehe
`client/src/api/songApi.ts`).

> **Wichtig:** aktuell läuft das Backend per Default auf Port **5000**, während
> das Frontend Port **5001** anspricht. Für den End-to-End-Betrieb musst du
> entweder `PORT=5001` in `server/.env` setzen oder `API_BASE_URL` in
> `client/src/api/songApi.ts` ändern. Steht weiter unten auch unter „Bekannte
> Einschränkungen".

CORS ist mit den Defaults von `cors()` aktiviert; im Dev kann also jeder Origin
die API aufrufen.

---

## 7. Bekannte Einschränkungen

Das sind echte, beobachtbare Probleme im aktuellen Code. Der Refactor-Plan
schlägt für jedes davon eine Lösung vor.

- **Port-Mismatch.** Server-Default `5000`; Frontend hartcodiert `127.0.0.1:5001`.
  Muss manuell angeglichen werden.
- **Hartcodierte API-Base-URL.** `client/src/api/songApi.ts` verwendet das
  Literal `http://127.0.0.1:5001/api/songs`. Nicht pro Umgebung konfigurierbar.
- **Doppelte Routen.** `songRoutes.ts` registriert jede Route zweimal (Zeilen
  12–16 und 18–22). Harmlos, weil Express den ersten passenden Handler nimmt,
  aber verwirrend.
- **Zwei `.env`-Dateien.** Es gibt `/.env` und `/server/.env`; geladen wird nur
  die im `server/`-Ordner.
- **`src_backup/` ist toter Code.** Vorgängerversion vor der Aufteilung,
  nirgends mehr eingebunden.
- **Teil-Mismatch bei `update`/`create`.** `updateSong` überschreibt bei jedem
  PUT alle Felder (jedes nicht gesendete Feld wird zu `""` oder `[]`). Ein
  partielles Bearbeiten eines Teilsets ist nicht sicher.
- **Keine gemeinsamen Typen.** Client und Server deklarieren beide einen
  `Song`-Typ; Drift ist möglich.
- **Keine Validierungsbibliothek.** Validierung passiert von Hand im Controller.
- **Keine Tests.** Weder Jest noch Vitest oder Ähnliches eingerichtet.
- **UI-Beschriftungen gemischt Deutsch/Englisch** („Songtitel", „Artist",
  „Feeling", „Assoziationen"). Aktuell okay, später sollte das angeglichen
  werden.
- **`SongDetailPage` zeigt den „Bearbeiten"-Link vor dem Hero,** wodurch der
  Seitenkopf optisch holprig wirkt.
- **Kein eigener Empty-State** außer dem schlichten „Keine Songs gefunden."
- **Löschen nutzt `window.confirm`** — funktioniert, passt aber nicht ganz zur
  übrigen Designsprache.

---

## 8. Empfohlene nächste Refactor-Schritte

Sortiert vom geringsten Risiko aufwärts. Jeder Schritt hält die laufende App
intakt.

1. Port-Mismatch beheben und die API-Base-URL in eine Vite-Env-Variable
   verschieben (`VITE_API_BASE_URL`).
2. Doppelte Routen in `songRoutes.ts` entfernen.
3. Den toten Ordner `src_backup/` aus dem Projekt ausgliedern.
4. Einen gemeinsamen `Song`-Typ oder ein kleines `@shared/`-Paket einführen.
5. Ein `songType`-Enum-Feld am Modell und Formular ergänzen
   (`CHORAL` / `HYMN_ANTHEM` / `DWELLING` / `LOUANGE`) **ohne** bestehende
   Felder zu entfernen.
6. Schritt für Schritt das UI auf AGG Musik umbranden (Titel, Navigation,
   Texte).
7. Die neuen Felder für Tonart/Übersetzung/Solmisation inkrementell hinzufügen,
   wie in `docs/REFACTOR_PLAN.md` beschrieben.

---

## 9. Wo es weitergeht

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — wie die Teile
  zusammenpassen und wie ein einzelner Request durch das System fließt.
- [`docs/MODULES.md`](docs/MODULES.md) — Datei-für-Datei-Tour.
- [`docs/REFACTOR_PLAN.md`](docs/REFACTOR_PLAN.md) — der sichere Weg zum AGG
  Musik Repertoire Tool.
