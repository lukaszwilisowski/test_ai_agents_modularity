import mongoose, { Schema, type Document } from "mongoose";
import connectDB from "@/lib/database/connection";

interface DrumsDocument extends Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  brand: string;
  drumModel: string;
  pieces: number;
  drumType: "acoustic" | "electronic" | "hybrid";
  inStock: boolean;
}

const drumsSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    brand: { type: String, required: true },
    drumModel: { type: String, required: true },
    pieces: { type: Number, default: 5 },
    drumType: {
      type: String,
      enum: ["acoustic", "electronic", "hybrid"],
      default: "acoustic",
    },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Drums =
  mongoose.models.Drums || mongoose.model<DrumsDocument>("Drums", drumsSchema);

export const drumsModel = {
  async findAll() {
    await connectDB();
    return Drums.find({});
  },

  async findById(id: string) {
    await connectDB();
    return Drums.findById(id);
  },

  async create(data: Partial<DrumsDocument>) {
    await connectDB();
    return Drums.create(data);
  },

  async update(id: string, data: Partial<DrumsDocument>) {
    await connectDB();
    return Drums.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string) {
    await connectDB();
    return Drums.findByIdAndDelete(id);
  },

  async createSampleData() {
    await connectDB();
    const existingDrums = await Drums.find({});
    if (existingDrums.length > 0) {
      return existingDrums;
    }

    const sampleDrums = [
      {
        name: "Pearl Export Series",
        description: "Professional 5-piece drum kit perfect for rock and pop",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
        brand: "Pearl",
        drumModel: "Export EXX725S",
        pieces: 5,
        drumType: "acoustic",
        inStock: true,
      },
      {
        name: "Roland TD-17KVX",
        description: "Electronic drum kit with mesh heads and advanced sounds",
        price: 1699,
        image:
          "https://images.unsplash.com/photo-1571327073757-71d13c24de30?w=500",
        brand: "Roland",
        drumModel: "TD-17KVX",
        pieces: 5,
        drumType: "electronic",
        inStock: true,
      },
      {
        name: "DW Performance Series",
        description: "High-end maple shell drum kit with exceptional tone",
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
        brand: "DW",
        drumModel: "Performance Maple",
        pieces: 7,
        drumType: "acoustic",
        inStock: true,
      },
    ];

    return Drums.create(sampleDrums);
  },
};
