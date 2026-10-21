import { Request, Response } from "express";
import { SongModel } from "../models/Song";
import { normalizeProgression } from "../utils/normalizeProgression";

type CreateSongRequestBody = {
  title: string;
  artist?: string;
  tempo?: number;
  progression?: string;
  groove?: string;
  instruments?: string[];
  feeling?: string;
  associations?: string[];
  magicMoment?: string;
};

export async function createSong(
  req: Request<{}, {}, CreateSongRequestBody>,
  res: Response
): Promise<void>{
  try {
    const {
      title,
      artist,
      tempo,
      progression,
      groove,
      instruments,
      feeling,
      associations,
      magicMoment,
    } = req.body;

    if (!title || typeof title !== "string" || title.trim() === "") {
      res.status(400).json({ message: "Titel ist erforderlich." });
      return;
    }

    const cleanedProgression =
  typeof progression === "string" ? progression.trim() : "";

const normalizedProgression =
  cleanedProgression !== "" ? normalizeProgression(cleanedProgression) : "";

    const song = await SongModel.create({
      title: title.trim(),
      artist: typeof artist === "string" ? artist.trim() : "",
      tempo: typeof tempo === "number" ? tempo : undefined,
      progression: cleanedProgression,
      normalizedProgression,
            groove: typeof groove === "string" ? groove.trim() : "",
      instruments: Array.isArray(instruments) ? instruments : [],
      feeling: typeof feeling === "string" ? feeling.trim() : "",
      associations: Array.isArray(associations) ? associations : [],
      magicMoment: typeof magicMoment === "string" ? magicMoment.trim() : "",
    });

    res.status(201).json(song);
  } catch (error) {
    console.error("Fehler beim Erstellen des Songs:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}

export async function getSongs(req: Request, res: Response): Promise<void> {
  try {
    const {
      progression,
      feeling,
      groove,
tempo,
tempoMin,
tempoMax,      instrument,
      association,
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (typeof progression === "string" && progression.trim() !== "") {
filter.progression = { $regex: progression.trim(), $options: "i" };    }

    if (typeof feeling === "string" && feeling.trim() !== "") {
      filter.feeling = { $regex: feeling.trim(), $options: "i" };
    }

    if (typeof groove === "string" && groove.trim() !== "") {
      filter.groove = { $regex: groove.trim(), $options: "i" };
    }

if (typeof tempo === "string" && tempo.trim() !== "") {
  filter.tempo = Number(tempo);
}

if (
  (typeof tempoMin === "string" && tempoMin.trim() !== "") ||
  (typeof tempoMax === "string" && tempoMax.trim() !== "")
) {
  filter.tempo = {};

  if (typeof tempoMin === "string" && tempoMin.trim() !== "") {
    (filter.tempo as Record<string, number>).$gte = Number(tempoMin);
  }

  if (typeof tempoMax === "string" && tempoMax.trim() !== "") {
    (filter.tempo as Record<string, number>).$lte = Number(tempoMax);
  }
}

    if (typeof instrument === "string" && instrument.trim() !== "") {
      filter.instruments = { $regex: instrument.trim(), $options: "i" };
    }

    if (typeof association === "string" && association.trim() !== "") {
      filter.associations = { $regex: association.trim(), $options: "i" };
    }

    const songs = await SongModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json(songs);
  } catch (error) {
    console.error("Fehler beim Laden der Songs:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}

export async function getSongById(req: Request, res: Response): Promise<void> {
  try {
    const song = await SongModel.findById(req.params.id);

    if (!song) {
      res.status(404).json({ message: "Song nicht gefunden." });
      return;
    }

    res.status(200).json(song);
  } catch (error) {
    console.error("Fehler beim Laden des Songs:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}

export async function deleteSong(req: Request, res: Response): Promise<void> {
  try {
    const song = await SongModel.findByIdAndDelete(req.params.id);

    if (!song) {
      res.status(404).json({ message: "Song nicht gefunden." });
      return;
    }

    res.status(200).json({ message: "Song gelöscht." });
  } catch (error) {
    console.error("Fehler beim Löschen des Songs:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}

export async function updateSong(req: Request, res: Response): Promise<void> {
  try {
    const {
      title,
      artist,
      tempo,
      progression,
      groove,
      instruments,
      feeling,
      associations,
      magicMoment,
    } = req.body;

    const cleanedProgression =
      typeof progression === "string" ? progression.trim() : "";

    const normalizedProgression =
      cleanedProgression !== "" ? normalizeProgression(cleanedProgression) : "";

    const updatedSong = await SongModel.findByIdAndUpdate(
      req.params.id,
      {
        title: typeof title === "string" ? title.trim() : "",
        artist: typeof artist === "string" ? artist.trim() : "",
        tempo: tempo ? Number(tempo) : undefined,
        progression: cleanedProgression,
        normalizedProgression,
        groove: typeof groove === "string" ? groove.trim() : "",
        instruments: Array.isArray(instruments) ? instruments : [],
        feeling: typeof feeling === "string" ? feeling.trim() : "",
        associations: Array.isArray(associations) ? associations : [],
        magicMoment: typeof magicMoment === "string" ? magicMoment.trim() : "",
      },
      { new: true, runValidators: true }
    );

    if (!updatedSong) {
      res.status(404).json({ message: "Song nicht gefunden." });
      return;
    }

    res.status(200).json(updatedSong);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Songs:", error);
    res.status(500).json({ message: "Interner Serverfehler." });
  }
}