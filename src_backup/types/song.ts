export type Song = {
  _id: string;
  title: string;
  artist: string;
  analysisStatus: "offen" | "analysiert";
  createdAt: string;
  updatedAt: string;
};