export type Song = {
  _id: string;
  title: string;
  artist: string;
  tempo?: number;
  progression: string;
  groove: string;
  instruments: string[];
  feeling: string;
  magicMoment: string;
  associations: string[];
  analysisStatus: "offen" | "analysiert";
  createdAt: string;
  updatedAt: string;
};