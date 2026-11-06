import { Schema, model } from "mongoose";

// AAA: Es gibt nur ein Profil-Dokument, das Badge-Bild.
const profileSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    bildDataUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ProfileModel = model("Profile", profileSchema);
