import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI ist nicht definiert.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB verbunden.");
}
