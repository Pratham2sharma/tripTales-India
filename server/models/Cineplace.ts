import mongoose, { Document } from "mongoose";

export interface ICineplace extends Document {
  name: string;
  description?: string;
  movie: string;
  images: string[]; // Cloudinary URLs
  state?: string;
  bestTimeToVisit?: string;
  travelTips?: string;
  averageBudget?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const cinePlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    movie: { type: String, required: true },
    images: [{ type: String, required: true }], // Cloudinary URLs
    state: { type: String, required: true },
    bestTimeToVisit: { type: String, required: true },
    travelTips: { type: String, required: true },
    averageBudget: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cineplace ||
  mongoose.model("Cineplace", cinePlaceSchema);
