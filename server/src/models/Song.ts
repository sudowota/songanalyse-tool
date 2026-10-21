import { Schema, model, InferSchemaType } from "mongoose";

const songSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    artist: {
      type: String,
      trim: true,
      default: "",
    },
    tempo: {
      type: Number,
      min: 0,
    },
progression: {
  type: String,
  trim: true,
  default: "",
},
normalizedProgression: {
  type: String,
  trim: true,
  default: "",
},
    groove: {
      type: String,
      trim: true,
      default: "",
    },
    instruments: {
      type: [String],
      default: [],
    },
    feeling: {
      type: String,
      trim: true,
      default: "",
    },
    associations: {
      type: [String],
      default: [],
    },
    magicMoment: {
      type: String,
      trim: true,
      default: "",
    },
    analysisStatus: {
      type: String,
      enum: ["offen", "analysiert"],
      default: "offen",
    },
    
  },
  {
    timestamps: true,
  }
);

export type Song = InferSchemaType<typeof songSchema>;
export const SongModel = model("Song", songSchema);