import mongoose, { Schema, type Document } from "mongoose";
import connectDB from "@/lib/database/connection";

interface TvDocument extends Document {
  name: string;
  description?: string;
  price: number;
  image?: string;
  brand: string;
  model: string;
  screenSize: number; // in inches
  resolution: "720p" | "1080p" | "4K" | "8K";
  displayType: "LED" | "OLED" | "QLED" | "LCD";
  smartTV: boolean;
  inStock: boolean;
}

const tvSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    screenSize: { type: Number, required: true },
    resolution: {
      type: String,
      enum: ["720p", "1080p", "4K", "8K"],
      default: "1080p",
    },
    displayType: {
      type: String,
      enum: ["LED", "OLED", "QLED", "LCD"],
      default: "LED",
    },
    smartTV: { type: Boolean, default: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Tv = mongoose.models.Tv || mongoose.model<TvDocument>("Tv", tvSchema);

export const tvModel = {
  async findAll() {
    await connectDB();
    return Tv.find({});
  },

  async findById(id: string) {
    await connectDB();
    return Tv.findById(id);
  },

  async create(data: Partial<TvDocument>) {
    await connectDB();
    return Tv.create(data);
  },

  async update(id: string, data: Partial<TvDocument>) {
    await connectDB();
    return Tv.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id: string) {
    await connectDB();
    return Tv.findByIdAndDelete(id);
  },

  async createSampleData() {
    await connectDB();
    const existingTvs = await Tv.find({});
    if (existingTvs.length > 0) {
      return existingTvs;
    }

    const sampleTvs = [
      {
        name: 'Samsung 55" QLED 4K TV',
        description:
          "Quantum Dot technology with vibrant colors and HDR support",
        price: 899,
        image:
          "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
        brand: "Samsung",
        model: "QN55Q60C",
        screenSize: 55,
        resolution: "4K",
        displayType: "QLED",
        smartTV: true,
        inStock: true,
      },
      {
        name: 'LG 65" OLED C3 TV',
        description:
          "Self-lit OLED pixels for perfect blacks and infinite contrast",
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1461151304267-ef46a08eca35?w=500",
        brand: "LG",
        model: "OLED65C3PUA",
        screenSize: 65,
        resolution: "4K",
        displayType: "OLED",
        smartTV: true,
        inStock: true,
      },
      {
        name: 'Sony 43" LED 1080p TV',
        description: "Reliable LED display with clear picture quality",
        price: 399,
        image:
          "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=500",
        brand: "Sony",
        model: "KDL43W660F",
        screenSize: 43,
        resolution: "1080p",
        displayType: "LED",
        smartTV: false,
        inStock: true,
      },
    ];

    return Tv.create(sampleTvs);
  },
};
