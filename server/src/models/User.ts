import { Schema, model } from "mongoose";

// AAA: Ein Konto mit Benutzername, Passwort-Hash und einer Rolle.
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, trim: true, default: "" },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "teacher", "student"], default: "student" },
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);
